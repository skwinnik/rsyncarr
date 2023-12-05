import { Module } from '@nestjs/common';

import { FtpClient } from '@/ftp/ftp.client';

@Module({
  providers: [FtpClient],
  exports: [FtpClient],
})
export class FtpModule {}
