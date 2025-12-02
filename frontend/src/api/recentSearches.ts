export function saveRecentSearch(sport: string, term: string) {
  const key = `${sport}_recent_searches`;
  const history = JSON.parse(localStorage.getItem(key) || "[]");

  const filtered = history.filter((q: string) => q.toLowerCase() !== term.toLowerCase());

  const updated = [term, ...filtered].slice(0, 5); // max 5 items
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getRecentSearches(sport: string): string[] {
  const key = `${sport}_recent_searches`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function clearRecentSearches(sport: string) {
  const key = `${sport}_recent_searches`;
  localStorage.removeItem(key);
}
