import { Module } from '@nestjs/common';

import { FtpClientFactory } from '@/ftp/ftp-client.factory';

@Module({
  providers: [FtpClientFactory],
  exports: [FtpClientFactory],
})
export class FtpModule {}
