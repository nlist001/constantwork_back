import { Inject, Injectable, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  private logger = new Logger('CacheService');

  constructor(

    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}

  async setCache<T>(key: string, value: T): Promise<void>{
    this.logger.verbose('setCache: ',key, value)
    await this.cache.set(key,value)
  }

  async getCache<T>(key: string): Promise<T | undefined>{
    this.logger.verbose('getCache: ',key)

    return await this.cache.get(key)
  }


}