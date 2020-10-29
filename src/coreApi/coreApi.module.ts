import { HttpModule, Module } from '@nestjs/common';
import { coreApiService } from './services/coreApi.service';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),],
  providers: [coreApiService],
  controllers: [],
  exports: [coreApiService],
})
export class coreApiModule {}