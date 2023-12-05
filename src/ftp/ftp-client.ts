import * as SFTPClient from 'ssh2-sftp-client';

import { IConfig } from '@/config/types';
import { IFtpClientOptions } from '@/ftp/types';

export class FtpClient {
  private client: SFTPClient;
  private options: IFtpClientOptions;

  constructor(config: IConfig) {
    this.client = new SFTPClient();
    this.options = {
      host: config.auth.host,
      port: config.auth.port,
      username: config.auth.username,
      password: config.auth.password,
    };

    this.client.on('end', () => {
      this.isConnected = false;
    });

    this.client.on('close', () => {
      this.isConnected = false;
    });
  }

  private isConnected = false;

  private async connect() {
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

  public async list(remoteFilePath: string) {
    await this.connect();

    return this.client.list(remoteFilePath);
  }

  public async fastGet(
    remoteFilePath: string,
    localFilePath: string,
    step: (totalTransferred: number, chunk: number, total: number) => void,
  ) {
    await this.connect();
    return this.client.fastGet(remoteFilePath, localFilePath, {
      step,
    });
  }

  public async stat(remoteFilePath: string) {
    await this.connect();
    return this.client.stat(remoteFilePath);
  }
}
