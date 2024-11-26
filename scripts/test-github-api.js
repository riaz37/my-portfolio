async function testGitHubAPI() {
  try {
    console.log('Testing GitHub API endpoints...\n');

    // Test stats endpoint
    console.log('Testing /api/github/stats...');
    const statsRes = await fetch('http://localhost:3000/api/github/stats');
    console.log('Status:', statsRes.status);
    const statsData = await statsRes.json();
    console.log('Response:', statsData, '\n');

    // Test repos endpoint
    console.log('Testing /api/github/repos...');
    const reposRes = await fetch('http://localhost:3000/api/github/repos');
    console.log('Status:', reposRes.status);
    const reposData = await reposRes.json();
    console.log('Response:', reposData, '\n');

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testGitHubAPI();
