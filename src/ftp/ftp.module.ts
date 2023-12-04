import { Module } from '@nestjs/common';

import { FtpClient } from '@/ftp/ftp.client';
import { FtpService } from '@/ftp/ftp.service';

@Module({
  providers: [FtpService, FtpClient],
  exports: [FtpService],
})
export class FtpModule {}
