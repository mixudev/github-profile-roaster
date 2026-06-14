// ============================================================
// Shared TypeScript types for the entire application
// ============================================================

export type HeatLevel = 'singe' | 'burn' | 'nuclear';
export type Language = 'en' | 'id';
export type AIProvider = 'gemini' | 'grok' | 'groq' | 'openrouter' | 'openai';
export type SoundType = 'hover' | 'click' | 'success' | 'laser' | 'burn';

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  company: string;
  location: string;
  blog: string;
  avatar_url: string;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

export interface RoastResult {
  developerTitle: string;
  statsRoast: string;
  bioRoast: string;
  reposRoast: string;
  theMainRoast: string;
  roastedTags: string[];
  burnScore: number;
}

export interface PresetProfile {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  mockRoastEn: RoastResult;
  mockRoastId: RoastResult;
}

export interface RoastRequest {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  heatLevel: HeatLevel;
  language: Language;
}

export interface ApiKeyRotator {
  keys: string[];
  currentIndex: number;
  getKey(): string;
  rotateOnFailure(): boolean; // returns false if no more keys
}
