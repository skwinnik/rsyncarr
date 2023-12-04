import * as fs from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';

import { FtpClient } from '@/ftp/ftp.client';

@Injectable()
export class FtpService {
  private readonly logger = new Logger(FtpService.name);
  constructor(private readonly client: FtpClient) {}

  public async list(remoteFilePath: string) {
    await this.client.connect();

    return this.client.list(remoteFilePath);
  }

  public async get(remoteFilePath: string, localFilePath: string) {
    await this.client.connect();

    this.createPath(localFilePath);
    await this.client.get(
      remoteFilePath,
      localFilePath,
      new Logger(path.basename(localFilePath)),
    );
  }

  private createPath(localFilePath: string) {
    const dirName = path.dirname(localFilePath);

    if (fs.existsSync(dirName)) {
      return;
    }

    fs.mkdirSync(dirName, { recursive: true });
  }
}
