import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from '@/config/config.module';
import { FtpModule } from '@/ftp/ftp.module';
import { SyncScheduleModule } from '@/sync-schedule/sync-schedule.module';

import { SyncModule } from './sync/sync.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    FtpModule,
    SyncModule,
    SyncScheduleModule,
    FilesModule,
  ],
})
export class AppModule {}
