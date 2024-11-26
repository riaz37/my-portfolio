import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const username = process.env.GITHUB_USERNAME || "riaz37";

export async function GET() {
  try {
    if (!process.env.GITHUB_TOKEN) {
      console.error("GITHUB_TOKEN is not set");
      return NextResponse.json(
        { error: "GitHub token is not configured" },
        { status: 500 }
      );
    }

    // Fetch user data
    try {
      const { data: user } = await octokit.users.getByUsername({
        username,
      });

      // Fetch repositories
      const { data: repos } = await octokit.repos.listForUser({
        username,
        sort: "updated",
        per_page: 100,
      });

      // Calculate total stars
      const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

      // Calculate languages
      const languages: { [key: string]: number } = {};
      await Promise.all(
        repos.map(async (repo) => {
          if (!repo.fork) {
            try {
              const { data: repoLanguages } = await octokit.repos.listLanguages({
                owner: username,
                repo: repo.name,
              });
              Object.entries(repoLanguages).forEach(([lang, bytes]) => {
                languages[lang] = (languages[lang] || 0) + bytes;
              });
            } catch (error) {
              console.error(`Error fetching languages for ${repo.name}:`, error);
            }
          }
        })
      );

      // Sort languages by bytes and take top 5
      const topLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      // Get contribution stats for the last year
      const { data: contributionData } = await octokit.rest.search.commits({
        q: `author:${username} author-date:>${new Date(
          Date.now() - 365 * 24 * 60 * 60 * 1000
        ).toISOString()}`,
        per_page: 1,
      });

      const stats = {
        totalRepos: user.public_repos,
        totalStars,
        followers: user.followers,
        following: user.following,
        contributions: contributionData.total_count,
        topLanguages,
        profileUrl: user.html_url,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        location: user.location,
        name: user.name,
        company: user.company,
        blog: user.blog,
        twitterUsername: user.twitter_username,
      };

      return NextResponse.json(stats);
    } catch (error: any) {
      console.error("GitHub API Error:", {
        message: error.message,
        status: error.status,
        response: error.response?.data,
      });
      
      return NextResponse.json(
        { 
          error: "Failed to fetch GitHub data",
          details: error.message,
          status: error.status 
        },
        { status: error.status || 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
