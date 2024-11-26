import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

// Safe JavaScript execution in a sandbox
function safeEvalJS(code: string, input: any) {
  const context = {
    input,
    result: undefined,
    console: {
      log: (...args: any[]) => {
        context.logs.push(args.map(arg => String(arg)).join(' '));
      }
    },
    logs: [] as string[]
  };

  try {
    // Wrap user code in a function and strict mode
    const wrappedCode = `
      'use strict';
      ${code}
      return twoSum(input.nums, input.target);
    `;

    // Create a function from the code
    const fn = new Function('input', 'console', wrappedCode);
    
    // Execute the function with the safe console
    context.result = fn(input, context.console);

    return {
      success: true,
      result: context.result,
      logs: context.logs,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      result: null,
      logs: context.logs,
      error: error.message
    };
  }
}

// Execute Python code in a separate process
async function executePython(code: string, input: any): Promise<any> {
  const tempDir = tmpdir();
  const pythonFile = join(tempDir, `code_${Date.now()}.py`);
  const inputFile = join(tempDir, `input_${Date.now()}.json`);

  // Write the code and input to temporary files
  const wrappedCode = `
import json
import sys

def run_test():
    with open('${inputFile}') as f:
        input_data = json.load(f)
    
    nums = input_data['nums']
    target = input_data['target']
    
${code.split('\n').map(line => '    ' + line).join('\n')}

    result = two_sum(nums, target)
    print(json.dumps(result))

if __name__ == '__main__':
    run_test()
`;

  await writeFile(pythonFile, wrappedCode);
  await writeFile(inputFile, JSON.stringify(input));

  return new Promise((resolve) => {
    const python = spawn('python3', [pythonFile]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', () => {
      try {
        // Clean up temporary files
        Promise.all([
          writeFile(pythonFile, ''),
          writeFile(inputFile, '')
        ]).catch(console.error);

        if (error) {
          resolve({
            success: false,
            result: null,
            logs: [],
            error
          });
        } else {
          const result = JSON.parse(output.trim());
          resolve({
            success: true,
            result,
            logs: [],
            error: null
          });
        }
      } catch (e) {
        resolve({
          success: false,
          result: null,
          logs: [],
          error: e.message
        });
      }
    });
  });
}

export async function POST(request: Request) {
  try {
    const { code, language, testCases } = await request.json();

    // Run the code against each test case
    const results = await Promise.all(testCases.map(async (testCase: any) => {
      const executor = language === 'python' ? executePython : safeEvalJS;
      const { success, result, logs, error } = await executor(code, testCase.input);
      
      if (!success) {
        return {
          input: testCase.input,
          expectedOutput: testCase.output,
          error,
          logs,
          passed: false
        };
      }

      // Compare arrays by converting them to strings
      const passed = JSON.stringify(result) === JSON.stringify(testCase.output);
      return {
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: result,
        logs,
        passed
      };
    }));

    // Format the output
    const output = results
      .map((result, index) => {
        const header = `Test Case ${index + 1}: ${result.passed ? '✅ Passed' : '❌ Failed'}`;
        const input = `Input: nums=${JSON.stringify(result.input.nums)}, target=${result.input.target}`;
        const expected = `Expected: ${JSON.stringify(result.expectedOutput)}`;
        const actual = result.error 
          ? `Error: ${result.error}`
          : `Output: ${JSON.stringify(result.actualOutput)}`;
        const logs = result.logs.length 
          ? `Logs:\n${result.logs.map(log => `  ${log}`).join('\n')}`
          : '';

        return [header, input, expected, actual, logs].filter(Boolean).join('\n');
      })
      .join('\n\n');

    const allPassed = results.every(result => result.passed);
    const summary = allPassed 
      ? '\n\n🎉 All test cases passed! Great job!'
      : '\n\n❌ Some test cases failed. Keep trying!';

    return NextResponse.json({
      output: output + summary,
      success: allPassed,
      results
    });

  } catch (error) {
    return NextResponse.json({
      output: `Error: ${error.message}`,
      success: false,
      results: []
    }, { status: 500 });
  }
}
