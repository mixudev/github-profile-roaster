/**
 * API Key Rotator
 * Keys are read lazily on first use so that dotenv.config() has time to run.
 */
export class KeyRotator {
  private envVar: string;
  private _keys: string[] | null = null;
  private index: number = 0;
  private exhausted: Set<number> = new Set();

  constructor(envVar: string) {
    // Store the env var NAME, not the value — read lazily on first use
    this.envVar = envVar;
  }

  private get keys(): string[] {
    if (this._keys === null) {
      const raw = process.env[this.envVar] || '';
      this._keys = raw
        .split(',')
        .map((k) => k.trim().replace(/^["']|["']$/g, '')) // strip surrounding quotes
        .filter(Boolean);
    }
    return this._keys;
  }

  get hasKeys(): boolean {
    return this.keys.length > 0;
  }

  get currentKey(): string {
    return this.keys[this.index] || '';
  }

  get totalKeys(): number {
    return this.keys.length;
  }

  /** Mark the current key as failed and rotate to next. Returns false if all exhausted. */
  rotate(): boolean {
    this.exhausted.add(this.index);
    const next = this.keys.findIndex((_, i) => !this.exhausted.has(i));
    if (next === -1) return false;
    this.index = next;
    return true;
  }

  /** Reset for a fresh request */
  reset(): void {
    this._keys = null; // re-read env on next access (picks up any runtime changes)
    this.exhausted.clear();
    this.index = 0;
  }
}
