import { BaseTemplate } from '../BaseTemplate';

interface WeeklyChallenge {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  estimatedTime: string;
  points: number;
  url: string;
}

interface TopPerformer {
  name: string;
  points: number;
  completionTime: string;
}

interface WeeklyChallengeEmailProps {
  name: string;
  weekNumber: number;
  mainChallenge: WeeklyChallenge;
  bonusChallenges?: WeeklyChallenge[];
  previousWeekTopPerformers?: TopPerformer[];
  userStreak?: number;
}

export const WeeklyChallengeEmail: React.FC<WeeklyChallengeEmailProps> = ({
  name,
  weekNumber,
  mainChallenge,
  bonusChallenges = [],
  previousWeekTopPerformers = [],
  userStreak,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#059669';
      case 'Medium':
        return '#d97706';
      case 'Hard':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  return (
    <BaseTemplate previewText={`Week ${weekNumber} Coding Challenge: ${mainChallenge.title}`}>
      <div>
        <h1>Weekly Coding Challenge #{weekNumber} 🚀</h1>
        <p>Hi {name},</p>
        
        {userStreak && userStreak > 1 && (
          <div style={{
            background: '#fef3c7',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center' as const,
          }}>
            <p style={{
              margin: '0',
              color: '#92400e',
              fontSize: '16px',
              fontWeight: 'bold',
            }}>
              🔥 You're on a {userStreak}-week streak! Keep it up!
            </p>
          </div>
        )}

        {/* Main Challenge */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <span style={{
              background: getDifficultyColor(mainChallenge.difficulty),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              {mainChallenge.difficulty}
            </span>
            <span style={{
              color: '#6b7280',
              fontSize: '14px',
            }}>
              {mainChallenge.category}
            </span>
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 12px',
            color: '#1a1a1a',
          }}>
            {mainChallenge.title}
          </h2>

          <p style={{
            color: '#4b5563',
            fontSize: '16px',
            lineHeight: '1.5',
            margin: '0 0 20px',
          }}>
            {mainChallenge.description}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            color: '#6b7280',
            fontSize: '14px',
          }}>
            <span>⏱️ Est. Time: {mainChallenge.estimatedTime}</span>
            <span>🏆 Points: {mainChallenge.points}</span>
          </div>

          <div className="text-center">
            <a href={mainChallenge.url} className="button">
              Start Challenge
            </a>
          </div>
        </div>

        {/* Bonus Challenges */}
        {bonusChallenges.length > 0 && (
          <>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '16px',
            }}>
              Bonus Challenges 💪
            </h2>
            <div style={{ marginBottom: '32px' }}>
              {bonusChallenges.map((challenge, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderLeft: '3px solid #4f46e5',
                    marginBottom: '16px',
                    background: '#ffffff',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: getDifficultyColor(challenge.difficulty),
                      fontSize: '14px',
                      fontWeight: '500',
                    }}>
                      {challenge.difficulty}
                    </span>
                    <span style={{
                      color: '#6b7280',
                      fontSize: '14px',
                    }}>
                      {challenge.points} pts
                    </span>
                  </div>
                  <p style={{
                    margin: '0 0 8px',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                  }}>
                    {challenge.title}
                  </p>
                  <p style={{
                    margin: '0 0 12px',
                    fontSize: '14px',
                    color: '#4b5563',
                  }}>
                    {challenge.description}
                  </p>
                  <a
                    href={challenge.url}
                    style={{
                      color: '#4f46e5',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Try this challenge →
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Previous Week's Top Performers */}
        {previousWeekTopPerformers.length > 0 && (
          <>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '16px',
            }}>
              Last Week's Top Performers 🏆
            </h2>
            <div style={{
              background: '#f8fafc',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
            }}>
              {previousWeekTopPerformers.map((performer, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < previousWeekTopPerformers.length - 1 ? '1px solid #e2e8f0' : 'none',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      color: '#6b7280',
                      fontSize: '14px',
                    }}>
                      #{index + 1}
                    </span>
                    <span style={{
                      color: '#1a1a1a',
                      fontWeight: '500',
                    }}>
                      {performer.name}
                    </span>
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '14px',
                  }}>
                    {performer.points} pts • {performer.completionTime}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <p>
          Remember, consistency is key to improving your coding skills. Take on these
          challenges and push your boundaries!
        </p>

        <div className="text-center my-8">
          <a href="{{dashboard_url}}" className="button">
            View All Challenges
          </a>
        </div>

        <p>
          Happy coding!<br />
          The CodePlayground Team
        </p>
      </div>
    </BaseTemplate>
  );
};
