interface CacheEntry<T> {
  value: T;
  expireAt: number;
}

export class CacheService<T = any> {
  private cache: Map<string, CacheEntry<T>>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, value: T, ttl: number): void {
    const expireAt = Date.now() + ttl;
    this.cache.set(key, { value, expireAt });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (item.expireAt && item.expireAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidateAll(): void {
    this.cache.clear();
  }
}
