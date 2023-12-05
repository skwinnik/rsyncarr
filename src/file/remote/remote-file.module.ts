import { Module } from '@nestjs/common';

import { RemoteFileService } from '@/file/remote/remote-file.service';
import { FtpModule } from '@/ftp/ftp.module';

@Module({
  imports: [FtpModule],
  providers: [RemoteFileService],
  exports: [RemoteFileService],
})
export class RemoteFileModule {}
