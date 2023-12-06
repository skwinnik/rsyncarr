import { Module } from '@nestjs/common';

import { NotificationModule } from '@/notification/notification.module';
import { SyncModule } from '@/sync/sync.module';
import { SyncScheduleService } from '@/sync-schedule/sync-schedule.service';

@Module({
  imports: [SyncModule, NotificationModule],
  providers: [SyncScheduleService],
})
export class SyncScheduleModule {}
