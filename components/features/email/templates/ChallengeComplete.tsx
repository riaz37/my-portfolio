import { BaseTemplate } from '../BaseTemplate';

interface ChallengeCompleteProps {
  name: string;
  challengeTitle: string;
  timeSpent: number; // in minutes
  nextChallenge?: {
    title: string;
    url: string;
    difficulty: string;
  };
  earnedPoints: number;
  newBadge?: {
    name: string;
    description: string;
  };
}

export const ChallengeComplete: React.FC<ChallengeCompleteProps> = ({
  name,
  challengeTitle,
  timeSpent,
  nextChallenge,
  earnedPoints,
  newBadge,
}) => {
  return (
    <BaseTemplate previewText="Congratulations on completing your coding challenge!">
      <div>
        <h1>Challenge Completed! 🎉</h1>
        <p>Great work, {name}!</p>
        
        {/* Challenge Stats */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center' as const,
        }}>
          <h2 style={{
            fontSize: '20px',
            margin: '0 0 16px',
            color: '#166534',
          }}>
            You've completed
          </h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 8px',
            color: '#166534',
          }}>
            {challengeTitle}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '16px',
          }}>
            <div>
              <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold', color: '#166534' }}>
                {Math.floor(timeSpent / 60)}h {timeSpent % 60}m
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#166534' }}>
                Time Spent
              </p>
            </div>
            <div>
              <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold', color: '#166534' }}>
                +{earnedPoints}
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#166534' }}>
                Points Earned
              </p>
            </div>
          </div>
        </div>

        {/* New Badge (if earned) */}
        {newBadge && (
          <div style={{
            background: '#fef3c7',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'center' as const,
          }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 8px', color: '#92400e' }}>
              New Badge Earned! 🏅
            </h2>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#92400e' }}>
              {newBadge.name}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#92400e' }}>
              {newBadge.description}
            </p>
          </div>
        )}

        {/* Next Challenge */}
        {nextChallenge && (
          <div style={{
            marginTop: '24px',
            marginBottom: '24px',
          }}>
            <h2 style={{ fontSize: '18px' }}>Ready for Your Next Challenge?</h2>
            <div style={{
              padding: '16px',
              borderLeft: '3px solid #4f46e5',
              marginTop: '12px',
            }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>{nextChallenge.title}</p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#64748b' }}>
                Difficulty: {nextChallenge.difficulty}
              </p>
              <div className="text-center my-8">
                <a href={nextChallenge.url} className="button">
                  Start Next Challenge
                </a>
              </div>
            </div>
          </div>
        )}

        <p>
          Keep pushing yourself and tackling new challenges. You're making great progress!
        </p>
        <p>
          Happy coding!<br />
          The CodePlayground Team
        </p>
      </div>
    </BaseTemplate>
  );
};
