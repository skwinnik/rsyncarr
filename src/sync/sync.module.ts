import { Module } from '@nestjs/common';

import { FilesModule } from '@/files/files.module';
import { FtpModule } from '@/ftp/ftp.module';
import { SyncService } from '@/sync/sync.service';

@Module({
  imports: [FtpModule, FilesModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
