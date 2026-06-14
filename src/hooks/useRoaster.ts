import React, { useState, useEffect } from 'react';
import type { GitHubProfile, GitHubRepo, RoastResult, HeatLevel, Language } from '../types';
import { PRESET_PROFILES } from '../data/presets';
import { FUNNY_LOADING_STEPS_EN, FUNNY_LOADING_STEPS_ID } from '../data/loadingSteps';

export function useRoaster() {
  const [username, setUsername] = useState('');
  const [heatLevel, setHeatLevel] = useState<HeatLevel>('nuclear');
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [fetchedProfile, setFetchedProfile] = useState<GitHubProfile | null>(null);
  const [fetchedRepos, setFetchedRepos] = useState<GitHubRepo[]>([]);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>('');

  const activeLoadingSteps = language === 'en' ? FUNNY_LOADING_STEPS_EN : FUNNY_LOADING_STEPS_ID;

  // Rotate loading steps while loading
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % activeLoadingSteps.length);
      }, 700);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading, activeLoadingSteps]);

  // Sync language change for preset profiles — re-renders the correct mock roast
  useEffect(() => {
    if (!fetchedProfile) return;
    const presetKey = Object.keys(PRESET_PROFILES).find(
      (key) => PRESET_PROFILES[key].profile.login.toLowerCase() === fetchedProfile.login.toLowerCase()
    );
    if (presetKey) {
      const item = PRESET_PROFILES[presetKey];
      setRoastResult(language === 'id' ? item.mockRoastId : item.mockRoastEn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Only re-run when language changes, not on profile change

  const handlePresetSelect = (key: string, playSound?: (t: any) => void) => {
    if (playSound) playSound('click');
    const item = PRESET_PROFILES[key];
    setUsername(item.profile.login);
    setError(null);
    setLoading(true);

    // Capture current language at call time to avoid stale closure
    const currentLanguage = language;

    setTimeout(() => {
      setFetchedProfile(item.profile);
      setFetchedRepos(item.repos);
      // Use captured language value — guaranteed to match what user selected
      setRoastResult(currentLanguage === 'id' ? item.mockRoastId : item.mockRoastEn);
      setActiveProvider('preset');
      setLoading(false);
      if (playSound) playSound('success');
    }, 1800);
  };

  const handleCopy = (playSound?: (t: any) => void) => {
    if (playSound) playSound('laser');
    if (!roastResult || !fetchedProfile) return;

    const shareTitle = language === 'id' ? 'HASIL METODE SARKASME GITHUB PROFILE' : 'GITHUB PROFILE ROASTED';
    const statusLabel = language === 'id' ? 'Gelar' : 'Title';
    const burnRatingLabel = language === 'id' ? 'Skor Mental Damage' : 'Burn Score';

    const shareText = `🔥 ${shareTitle}: @${fetchedProfile.login} (${fetchedProfile.name})
💻 ${statusLabel}: ${roastResult.developerTitle}
💥 ${burnRatingLabel}: ${roastResult.burnScore}/100

⭐ [STATS ROAST]
${roastResult.statsRoast}

⭐ [BIO ROAST]
${roastResult.bioRoast}

⭐ [MAIN INCINERATION]
${roastResult.theMainRoast}

Tags: ${roastResult.roastedTags.join(' ')}
Roasted live at the GitHub Profile Roaster!`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = (playSound?: (t: any) => void) => {
    if (playSound) playSound('click');
    setRoastResult(null);
    setFetchedProfile(null);
    setFetchedRepos([]);
    setError(null);
    setActiveProvider('');
  };

  const handleRoastRequest = async (
    e: React.FormEvent,
    playSound?: (t: any) => void
  ) => {
    e.preventDefault();
    if (playSound) playSound('click');
    setError(null); // Always clear previous errors at start of new request

    const trimmedUsername = username.trim().toLowerCase();
    if (!trimmedUsername) {
      setError(
        language === 'id'
          ? 'MASUKKAN USERNAME GITHUB SANG KORBAN DULU, NYALI LU MANA?!'
          : 'ENTER A VALID GITHUB USERNAME FIRST, YOU COWARD.'
      );
      if (playSound) playSound('burn');
      return;
    }

    // Use preset data if available
    if (PRESET_PROFILES[trimmedUsername]) {
      handlePresetSelect(trimmedUsername, playSound);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Fetch GitHub data via backend proxy
      const githubRes = await fetch(`/api/github/${encodeURIComponent(trimmedUsername)}`);
      if (!githubRes.ok) {
        const errJson = await githubRes.json();
        throw new Error(errJson.error || 'GitHub account fetch request failed.');
      }
      const githubData = await githubRes.json();

      setFetchedProfile(githubData.profile);
      setFetchedRepos(githubData.repos);

      // Step 2: Generate roast via backend AI proxy
      const roastRes = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: githubData.profile,
          repos: githubData.repos,
          heatLevel,
          language
        })
      });

      if (!roastRes.ok) {
        const errJson = await roastRes.json();
        throw new Error(errJson.error || 'Generation error inside the roast chamber.');
      }

      const data = await roastRes.json();
      setError(null); // Clear any stale errors before showing result
      setRoastResult(data.roast);
      setActiveProvider(data.provider || '');

      setTimeout(() => {
        setLoading(false);
        if (playSound) playSound('success');
      }, 500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Incinerator power supply failed. Retry or use presets!');
      setLoading(false);
      if (playSound) playSound('burn');
    }
  };

  return {
    // State
    username, setUsername,
    heatLevel, setHeatLevel,
    language, setLanguage,
    loading,
    loadingStep,
    error,
    fetchedProfile,
    fetchedRepos,
    roastResult,
    copied,
    activeProvider,
    activeLoadingSteps,
    // Handlers
    handlePresetSelect,
    handleCopy,
    handleReset,
    handleRoastRequest,
  };
}
