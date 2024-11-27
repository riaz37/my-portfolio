import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Template definitions
const templates = {
  welcome: {
    subject: 'Welcome to Our Newsletter!',
    content: `
      <h1>Welcome {{subscriber_name}}! 👋</h1>
      <p>
        We're excited to have you join our community of developers who are passionate
        about learning and improving their coding skills.
      </p>
      <p>
        With our platform, you'll have access to:
      </p>
      <ul style="color: #4a5568; padding-left: 20px;">
        <li>Interactive coding challenges</li>
        <li>Real-world programming projects</li>
        <li>Community discussions and support</li>
        <li>Progress tracking and achievements</li>
      </ul>
      <div style="text-align: center; margin: 2rem 0;">
        <a href="{{verification_url}}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Get Started
        </a>
      </div>
    `
  },
  'weekly-digest': {
    subject: 'Your Weekly Digest',
    content: `
      <h1>Your Weekly Developer Digest</h1>
      <div style="margin: 2rem 0;">
        <h2>This Week's Highlights</h2>
        <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 5px;">
          <h3>{{highlight_1_title}}</h3>
          <p>{{highlight_1_description}}</p>
        </div>
        <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 5px;">
          <h3>{{highlight_2_title}}</h3>
          <p>{{highlight_2_description}}</p>
        </div>
        <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 5px;">
          <h3>{{highlight_3_title}}</h3>
          <p>{{highlight_3_description}}</p>
        </div>
      </div>
    `
  },
  'challenge-complete': {
    subject: 'Challenge Complete!',
    content: `
      <h1>🎉 Congratulations!</h1>
      <p>You've successfully completed the <strong>{{challenge_name}}</strong> challenge.</p>
      <div style="margin: 2rem 0; padding: 1rem; background-color: #f7fafc; border-radius: 5px;">
        <h2>Your Achievement</h2>
        <p>Score: {{score}}</p>
      </div>
      <div style="margin: 2rem 0;">
        <h3>Ready for More?</h3>
        <p>Your next challenge awaits: <strong>{{next_challenge}}</strong></p>
        <div style="text-align: center; margin-top: 1rem;">
          <a href="{{dashboard_url}}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
            Start Next Challenge
          </a>
        </div>
      </div>
    `
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const templateId = params.id as keyof typeof templates;
    const template = templates[templateId];

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subject: template.subject,
      content: template.content.trim(),
    });
  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}
