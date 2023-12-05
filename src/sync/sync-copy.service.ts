import * as fs from 'fs';
import * as path from 'path';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { APP_CONFIG, IConfig } from '@/config/types';
import { LocalFileService } from '@/file/local/local-file.service';
import { RemoteFileService } from '@/file/remote/remote-file.service';
import { FtpClient } from '@/ftp/ftp.client';
import { DownloadLogger } from '@/lib/download-logger';

@Injectable()
export class SyncCopyService {
  private readonly logger = new Logger(SyncCopyService.name);
  private readonly lock = new Map<string, boolean>();
  private readonly paths: IConfig['paths'];

  constructor(
    private readonly ftpClient: FtpClient,
    private readonly localFileService: LocalFileService,
    private readonly remoteFileService: RemoteFileService,
    @Inject(APP_CONFIG) config: IConfig,
  ) {
    this.paths = config.paths;
  }

  public async copyRemote(pathName: string) {
    const path = this.paths.find((path) => path.name === pathName);
    if (!path) {
      throw new Error(`Path ${pathName} not found`);
    }

    if (this.lock.get(pathName)) {
      return;
    }

    this.logger.log(`Syncing ${pathName}`);
    this.lock.set(pathName, true);
    try {
      await this._sync(path.remotePath, path.localPath);
    } finally {
      this.lock.set(pathName, false);
      this.logger.log(`Syncing ${pathName} finished`);
    }
  }

  private async _sync(remotePath: string, localPath: string) {
    const remoteFiles = await this.remoteFileService.traverse(remotePath);

    for (const remoteFile of remoteFiles) {
      const localFullPath = remoteFile.fullPath.replace(remotePath, localPath);
      const localFile = {
        ...remoteFile,
        fullPath: localFullPath,
      };

      if (await this.localFileService.exists(localFile)) {
        this.logger.debug(`Skipping ${remoteFile.fullPath}`);
        continue;
      }

      await this.download(remoteFile.fullPath, localFullPath);
    }
  }

  private async download(remoteFilePath: string, localFilePath: string) {
    const downloadLogger = new DownloadLogger(localFilePath);

    this.createPath(localFilePath);

    downloadLogger.start();

    await this.ftpClient.fastGet(
      remoteFilePath,
      localFilePath,
      (totalTransferred, chunk, total) =>
        downloadLogger.step(totalTransferred, chunk, total),
    );

    downloadLogger.done();
  }

  private createPath(localFilePath: string) {
    const dirName = path.dirname(localFilePath);

    if (fs.existsSync(dirName)) {
      return;
    }

    fs.mkdirSync(dirName, { recursive: true });
  }
}
