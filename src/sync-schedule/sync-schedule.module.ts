import { Module } from '@nestjs/common';

import { SyncModule } from '@/sync/sync.module';
import { SyncScheduleService } from '@/sync-schedule/sync-schedule.service';

@Module({
  imports: [SyncModule],
  providers: [SyncScheduleService],
})
export class SyncScheduleModule {}
