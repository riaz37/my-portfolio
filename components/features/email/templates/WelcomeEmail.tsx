import { BaseTemplate } from '../BaseTemplate';

interface WelcomeEmailProps {
  name: string;
  verificationUrl?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  name,
  verificationUrl,
}) => {
  return (
    <BaseTemplate previewText="Welcome to CodePlayground! Let's start your coding journey.">
      <div>
        <h1>Welcome to CodePlayground, {name}! 👋</h1>
        <p>
          We're excited to have you join our community of developers who are passionate
          about learning and improving their coding skills.
        </p>
        <p>
          With CodePlayground, you'll have access to:
        </p>
        <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
          <li>Interactive coding challenges</li>
          <li>Real-world programming projects</li>
          <li>Community discussions and support</li>
          <li>Progress tracking and achievements</li>
        </ul>
        {verificationUrl && (
          <>
            <p>
              To get started, please verify your email address by clicking the button below:
            </p>
            <div className="text-center my-8">
              <a href={verificationUrl} className="button">
                Verify Email Address
              </a>
            </div>
          </>
        )}
        <p>
          Ready to start coding? Head over to our platform and dive into your first challenge!
        </p>
        <div className="text-center my-8">
          <a href="{{dashboard_url}}" className="button">
            Start Coding
          </a>
        </div>
        <p>
          If you have any questions, feel free to reply to this email. Our team is always
          here to help!
        </p>
        <p>
          Happy coding!<br />
          The CodePlayground Team
        </p>
      </div>
    </BaseTemplate>
  );
};
