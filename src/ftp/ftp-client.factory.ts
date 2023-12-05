import { Inject, Injectable } from '@nestjs/common';

import { APP_CONFIG, IConfig } from '@/config/types';
import { FtpClient } from '@/ftp/ftp-client';

@Injectable()
export class FtpClientFactory {
  constructor(@Inject(APP_CONFIG) private readonly config: IConfig) {}

  public create() {
    return new FtpClient(this.config);
  }
}
