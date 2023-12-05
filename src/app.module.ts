import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from '@/config/config.module';
import { FileModule } from '@/file/file.module';
import { FtpModule } from '@/ftp/ftp.module';
import { SyncModule } from '@/sync/sync.module';
import { SyncScheduleModule } from '@/sync-schedule/sync-schedule.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    FtpModule,
    SyncModule,
    SyncScheduleModule,
    FileModule,
  ],
})
export class AppModule {}
