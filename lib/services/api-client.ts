// Client-side API service
export interface CodeSnippet {
  _id?: string;
  userId: string;
  code: string;
  language: string;
  title: string;
  createdAt: Date;
}

// Save code snippet
export async function saveCodeSnippet(code: string, language: string, title: string) {
  const response = await fetch('/api/code-snippets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, language, title }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save code snippet');
  }

  return response.json();
}

// Get user's snippets
export async function getUserSnippets() {
  const response = await fetch('/api/code-snippets');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch snippets');
  }

  return response.json();
}

// Get specific snippet
export async function getSnippetById(id: string) {
  const response = await fetch(`/api/code-snippets?id=${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch snippet');
  }

  return response.json();
}

// Update snippet
export async function updateSnippet(id: string, updates: Partial<Omit<CodeSnippet, '_id' | 'userId' | 'createdAt'>>) {
  const response = await fetch('/api/code-snippets', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update snippet');
  }

  return response.json();
}

// Delete snippet
export async function deleteSnippet(id: string) {
  const response = await fetch(`/api/code-snippets?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete snippet');
  }

  return response.json();
}

// Execute code
export async function executeCode(code: string, language: string) {
  const response = await fetch('/api/execute-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, language }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to execute code');
  }

  return response.json();
}
