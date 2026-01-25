interface CachedContent {
  content: string;
  fetchedAt: string;
}

const cache = new Map<string, CachedContent>();

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export async function fetchGithubReadme(
  owner: string,
  repo: string,
  branch: string = 'main',
  path: string = 'README.md'
): Promise<string> {
  const cacheKey = `${owner}/${repo}/${branch}/${path}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    const cachedDate = new Date(cached.fetchedAt);
    const today = new Date();

    if (isSameDay(cachedDate, today)) {
      return cached.content;
    }
  }

  const url = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/${path}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();

    cache.set(cacheKey, {
      content,
      fetchedAt: new Date().toISOString(),
    });

    return content;
  } catch (error) {
    if (cached) {
      console.warn(`fetch failed, using stale cache: ${error}`);
      return cached.content;
    }

    throw error;
  }
}
