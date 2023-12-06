import { Inject, Injectable, Logger } from '@nestjs/common';

import { APP_CONFIG, IConfig } from '@/config/types';
import { LocalFileService } from '@/file/local/local-file.service';
import { RemoteFileService } from '@/file/remote/remote-file.service';
import { NotificationService } from '@/notification/notification.service';

@Injectable()
export class SyncCleanService {
  private readonly logger = new Logger(SyncCleanService.name);
  private readonly lock = new Map<string, boolean>();
  private readonly paths: IConfig['paths'];

  constructor(
    private readonly localFileService: LocalFileService,
    private readonly remoteFileService: RemoteFileService,
    private readonly notificationService: NotificationService,
    @Inject(APP_CONFIG) config: IConfig,
  ) {
    this.paths = config.paths;
  }

  public async cleanLocal(pathName: string) {
    const path = this.paths.find((path) => path.name === pathName);
    if (!path) {
      throw new Error(`Path ${pathName} not found`);
    }

    if (this.lock.get(pathName)) {
      return;
    }

    this.logger.log(`Cleaning ${pathName}`);
    this.lock.set(pathName, true);
    try {
      await this._clean(path.remotePath, path.localPath);
    } finally {
      this.lock.set(pathName, false);
      this.logger.log(`Cleaning ${pathName} finished`);
    }
  }

  private async _clean(remotePath: string, localPath: string) {
    const remoteFiles = await this.remoteFileService.traverse(remotePath);
    const localFiles = await this.localFileService.traverse(localPath);

    for (const localFile of localFiles) {
      const remoteFile = remoteFiles.find(
        (f) => f.fullPath === localFile.fullPath.replace(localPath, remotePath),
      );

      if (!remoteFile) {
        this.logger.log(`Removing ${localFile.fullPath}`);

        await this.localFileService.delete(localFile);

        await this.notificationService.cleaned(localFile);
      }
    }
  }
}
