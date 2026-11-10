import { Module} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { CacheService } from './cache.service';
import { ConfigService, ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    CacheModule.registerAsync({
        isGlobal: true,
        useFactory: async () => ({
          
            // max:100,
            // ttl:5,
            stores: [
              // new Keyv({
              //   store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
              // }),
              new KeyvRedis(process.env.REDIS_URL),
            ],
          
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    CacheService,
  ],
})
export class AppCacheModule {}
