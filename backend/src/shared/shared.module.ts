import { Global, Module } from '@nestjs/common';
import { DictionaryService } from './services/dictionary.service';

@Global()
@Module({
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class SharedModule {}
