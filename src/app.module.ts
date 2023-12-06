import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from '@/config/config.module';
import { FileModule } from '@/file/file.module';
import { FtpModule } from '@/ftp/ftp.module';
import { NotificationModule } from '@/notification/notification.module';
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
    NotificationModule,
  ],
})
export class AppModule {}
