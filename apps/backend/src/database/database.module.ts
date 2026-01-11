import { Module, Global } from '@nestjs/common';
import { getDatabase } from './index';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      useFactory: () => getDatabase(),
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
