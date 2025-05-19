import { Global, Module } from '@nestjs/common';
import { DictionaryService } from './services/dictionary.service';
import { RedisService } from './services/redis.service';

@Global()
@Module({
  providers: [DictionaryService, RedisService],
  exports: [DictionaryService, RedisService],
})
export class SharedModule {}
