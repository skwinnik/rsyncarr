import { Inject, Injectable, Logger } from '@nestjs/common';
import { last } from 'rxjs';
import * as SFTPClient from 'ssh2-sftp-client';

import { APP_CONFIG, IConfig } from '@/config/types';
import { IFile, IFtpClientOptions } from '@/ftp/types';

@Injectable()
export class FtpClient {
  private client: SFTPClient;
  private options: IFtpClientOptions;

  constructor(@Inject(APP_CONFIG) config: IConfig) {
    this.client = new SFTPClient();
    this.options = {
      host: config.auth.host,
      port: config.auth.port,
      username: config.auth.username,
      password: config.auth.password,
    };

    this.client.on('end', (error) => {
      this.isConnected = false;
    });

    this.client.on('close', (error) => {
      this.isConnected = false;
    });
  }

  private isConnected = false;

  public async connect() {
    if (this.isConnected) {
      return;
    }

    await this.client.connect({
      host: this.options.host,
      port: this.options.port,
      username: this.options.username,
      password: this.options.password,
    });

    this.isConnected = true;
  }

  public async list(remoteFilePath: string): Promise<IFile[]> {
    const files = await this.client.list(remoteFilePath);

    return files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));
  }

  public async get(
    remoteFilePath: string,
    localFilePath: string,
    logger: Logger,
  ) {
    const reportInterval = 3000;
    let lastReport: number | null = null;

    return this.client.fastGet(remoteFilePath, localFilePath, {
      step: (totalTransferred, chunk, total) => {
        if (lastReport && Date.now() - lastReport < reportInterval) {
          return;
        }

        lastReport = Date.now();

        logger.log(
          `Transferred: ${this.toHumanReadableSize(
            totalTransferred,
          )} / ${this.toHumanReadableSize(total)}`,
        );
      },
    });
  }

  private toHumanReadableSize(size: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const unitIndex = Math.floor(Math.log(size) / Math.log(1024));
    const unit = units[unitIndex];
    const readableSize = size / Math.pow(1024, unitIndex);
    return `${readableSize.toFixed(2)} ${unit}`;
  }
}
