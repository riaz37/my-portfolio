import { NextResponse } from 'next/server';
import { z } from 'zod';
import Docker from 'dockerode';

const docker = new Docker();

const executeRequestSchema = z.object({
  code: z.string(),
  language: z.enum(['javascript', 'python']),
  testCases: z.array(z.object({
    input: z.any(),
    output: z.string(),
  })),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, language, testCases } = executeRequestSchema.parse(body);

    // Prepare test runner code based on language
    const testRunnerCode = language === 'javascript' 
      ? prepareJavaScriptTest(code, testCases)
      : preparePythonTest(code, testCases);

    // Create container config based on language
    const containerConfig = {
      Image: language === 'javascript' ? 'node:18-alpine' : 'python:3.9-alpine',
      Cmd: language === 'javascript' 
        ? ['node', '-e', testRunnerCode]
        : ['python', '-c', testRunnerCode],
      NetworkDisabled: true,
      Memory: 50 * 1024 * 1024, // 50MB
      MemorySwap: 0,
      CpuPeriod: 100000,
      CpuQuota: 10000,
      Tty: true,
    };

    // Create and start container
    const container = await docker.createContainer(containerConfig);
    await container.start();

    // Get container logs
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });

    // Clean up container
    await container.stop();
    await container.remove();

    // Parse test results
    const output = logs.toString();
    const results = JSON.parse(output);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Code execution failed', details: error.message },
      { status: 500 }
    );
  }
}

function prepareJavaScriptTest(code: string, testCases: any[]) {
  return `
    ${code}
    
    const testCases = ${JSON.stringify(testCases)};
    const results = {
      passed: 0,
      failed: 0,
      cases: []
    };

    for (const testCase of testCases) {
      try {
        const input = testCase.input;
        const expectedOutput = JSON.parse(testCase.output);
        const actualOutput = JSON.stringify(twoSum(input.nums, input.target));
        
        const passed = actualOutput === JSON.stringify(expectedOutput);
        results.cases.push({
          input: testCase.input,
          expected: expectedOutput,
          actual: JSON.parse(actualOutput),
          passed
        });
        
        if (passed) results.passed++;
        else results.failed++;
      } catch (error) {
        results.cases.push({
          input: testCase.input,
          error: error.message,
          passed: false
        });
        results.failed++;
      }
    }

    console.log(JSON.stringify(results));
  `;
}

function preparePythonTest(code: string, testCases: any[]) {
  return `
import json

${code}

test_cases = json.loads('${JSON.stringify(testCases)}')
results = {
    "passed": 0,
    "failed": 0,
    "cases": []
}

for test_case in test_cases:
    try:
        input_data = test_case["input"]
        expected_output = json.loads(test_case["output"])
        actual_output = two_sum(input_data["nums"], input_data["target"])
        
        passed = json.dumps(actual_output) == json.dumps(expected_output)
        results["cases"].append({
            "input": input_data,
            "expected": expected_output,
            "actual": actual_output,
            "passed": passed
        })
        
        if passed:
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["cases"].append({
            "input": input_data,
            "error": str(e),
            "passed": False
        })
        results["failed"] += 1

print(json.dumps(results))
  `;
}
