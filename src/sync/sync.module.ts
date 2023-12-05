import { Module } from '@nestjs/common';

import { FileModule } from '@/file/file.module';
import { FtpModule } from '@/ftp/ftp.module';
import { SyncCleanService } from '@/sync/sync-clean.service';
import { SyncCopyService } from '@/sync/sync-copy.service';

@Module({
  imports: [FtpModule, FileModule],
  providers: [SyncCopyService, SyncCleanService],
  exports: [SyncCopyService, SyncCleanService],
})
export class SyncModule {}
