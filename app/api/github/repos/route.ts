import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const username = process.env.GITHUB_USERNAME || "riaz37";

export async function GET() {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: "updated",
      per_page: 9, // Increased to show more of your repositories
      direction: "desc",
    });

    // Filter out forked repositories and format the data
    const formattedRepos = repos
      .filter(repo => !repo.fork) // Only show your original repositories
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "No description available",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Other",
        url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
      }))
      .slice(0, 6); // Take the first 6 after filtering

    return NextResponse.json(formattedRepos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
