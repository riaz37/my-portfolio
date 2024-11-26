import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  totalRepos: number;
  topLanguages: { [key: string]: number };
  contributions: number;
  followers: number;
  following: number;
}

export async function getGitHubStats(username: string): Promise<GitHubStats> {
  try {
    // Get user data
    const { data: userData } = await octokit.users.getByUsername({
      username,
    });

    // Get repositories
    const { data: repos } = await octokit.repos.listForUser({
      username,
      per_page: 100,
      sort: 'updated',
    });

    // Calculate total stars
    const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    // Calculate languages
    const languages: { [key: string]: number } = {};
    await Promise.all(
      repos.map(async (repo) => {
        if (!repo.fork) {
          const { data: repoLanguages } = await octokit.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });
          Object.entries(repoLanguages).forEach(([lang, bytes]) => {
            languages[lang] = (languages[lang] || 0) + bytes;
          });
        }
      })
    );

    // Get total commits (approximation from contribution calendar)
    const contributionsQuery = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
          }
        }
      }
    `;

    const { user: { contributionsCollection } } = await octokit.graphql(contributionsQuery, { username });

    return {
      totalCommits: contributionsCollection.totalCommitContributions,
      totalPRs: contributionsCollection.totalPullRequestContributions,
      totalIssues: contributionsCollection.totalIssueContributions,
      totalStars,
      totalRepos: repos.filter(repo => !repo.fork).length,
      topLanguages: languages,
      contributions: contributionsCollection.totalCommitContributions +
                    contributionsCollection.totalPullRequestContributions +
                    contributionsCollection.totalIssueContributions,
      followers: userData.followers,
      following: userData.following,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
}
