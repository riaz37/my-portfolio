import { BaseTemplate } from '../BaseTemplate';

interface Challenge {
  title: string;
  difficulty: string;
  url: string;
}

interface Achievement {
  title: string;
  description: string;
}

interface WeeklyDigestProps {
  name: string;
  newChallenges: Challenge[];
  achievements: Achievement[];
  completedChallenges: number;
  totalMinutesCoded: number;
  rank?: string;
}

export const WeeklyDigest: React.FC<WeeklyDigestProps> = ({
  name,
  newChallenges,
  achievements,
  completedChallenges,
  totalMinutesCoded,
  rank,
}) => {
  return (
    <BaseTemplate previewText="Your weekly coding progress and new challenges await!">
      <div>
        <h1>Your Weekly Coding Digest 🚀</h1>
        <p>Hi {name},</p>
        <p>
          Here's your weekly roundup of achievements and new challenges to keep you
          coding strong!
        </p>

        {/* Weekly Stats */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>This Week's Stats 📊</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '150px', margin: '8px' }}>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>
                {completedChallenges}
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                Challenges Completed
              </p>
            </div>
            <div style={{ flex: '1', minWidth: '150px', margin: '8px' }}>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>
                {Math.round(totalMinutesCoded / 60)}h {totalMinutesCoded % 60}m
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                Time Spent Coding
              </p>
            </div>
            {rank && (
              <div style={{ flex: '1', minWidth: '150px', margin: '8px' }}>
                <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>
                  {rank}
                </p>
                <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                  Current Rank
                </p>
              </div>
            )}
          </div>
        </div>

        {/* New Challenges */}
        {newChallenges.length > 0 && (
          <>
            <h2 style={{ fontSize: '18px' }}>New Challenges This Week 💪</h2>
            <div style={{ marginBottom: '24px' }}>
              {newChallenges.map((challenge, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    borderLeft: '3px solid #4f46e5',
                    marginBottom: '12px',
                  }}
                >
                  <p style={{ margin: '0', fontWeight: 'bold' }}>{challenge.title}</p>
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#64748b' }}>
                    Difficulty: {challenge.difficulty}
                  </p>
                  <a
                    href={challenge.url}
                    style={{
                      color: '#4f46e5',
                      textDecoration: 'none',
                      fontSize: '14px',
                    }}
                  >
                    Try this challenge →
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <>
            <h2 style={{ fontSize: '18px' }}>Your Achievements 🏆</h2>
            <div style={{ marginBottom: '24px' }}>
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  style={{
                    background: '#fef3c7',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#92400e' }}>
                    {achievement.title}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '14px',
                      color: '#92400e',
                    }}
                  >
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center my-8">
          <a href="{{dashboard_url}}" className="button">
            Continue Coding
          </a>
        </div>

        <p>
          Keep up the great work!<br />
          The CodePlayground Team
        </p>
      </div>
    </BaseTemplate>
  );
};
