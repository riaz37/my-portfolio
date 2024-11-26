import { NextRequest, NextResponse } from 'next/server';

const PISTON_API_URL = process.env.NEXT_PUBLIC_PISTON_API_URL || 'https://emkc.org/api/v2/piston';

const languageConfigs = {
  javascript: {
    language: 'javascript',
    version: '18.15.0',
    files: [{ content: '' }],
  },
  python: {
    language: 'python',
    version: '3.10.0',
    files: [{ content: '' }],
  },
  html: {
    language: 'html',
    version: 'latest',
    files: [{ content: '' }],
  },
  css: {
    language: 'css',
    version: 'latest',
    files: [{ content: '' }],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Missing code or language' },
        { status: 400 }
      );
    }

    const config = languageConfigs[language as keyof typeof languageConfigs];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    config.files[0].content = code;

    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      output: result.run.output,
      language: result.language,
      version: result.version,
      ran: result.run.ran,
      stdout: result.run.stdout,
      stderr: result.run.stderr,
      error: result.message,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      {
        output: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        language: '',
        version: '',
        ran: false,
        stdout: '',
        stderr: '',
      },
      { status: 500 }
    );
  }
}
