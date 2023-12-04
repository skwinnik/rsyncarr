import { Inject, Injectable, Logger } from '@nestjs/common';

import { APP_CONFIG, IConfig } from '@/config/types';
import { FilesService } from '@/files/files.service';
import { FtpService } from '@/ftp/ftp.service';
import { IFile } from '@/ftp/types';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly lock = new Map<string, boolean>();
  private readonly paths: IConfig['paths'];

  constructor(
    private readonly ftpService: FtpService,
    private readonly filesService: FilesService,
    @Inject(APP_CONFIG) config: IConfig,
  ) {
    this.paths = config.paths;
  }

  public async sync(pathName: string) {
    const path = this.getPath(pathName);
    if (!path) {
      throw new Error(`Path ${pathName} not found`);
    }

    if (this.lock.get(pathName)) {
      return;
    }

    this.logger.log(`Syncing ${pathName}`);
    this.lock.set(pathName, true);
    try {
      await this._syncPath([], path.sourcePath, path.targetPath);
    } finally {
      this.lock.set(pathName, false);
      this.logger.log(`Syncing ${pathName} finished`);
    }
  }

  private async _syncPath(
    pathParts: string[],
    sourcePath: string,
    targetPath: string,
  ) {
    const files = await this.ftpService.list(
      [sourcePath, ...pathParts].join('/'),
    );
    for (const file of files) {
      if (file.type === 'd') {
        await this._syncPath([...pathParts, file.name], sourcePath, targetPath);
      } else {
        await this._syncFile(
          file,
          [...pathParts, file.name],
          sourcePath,
          targetPath,
        );
      }
    }
  }

  private async _syncFile(
    file: IFile,
    pathParts: string[],
    sourcePath: string,
    targetPath: string,
  ) {
    const localFilePath = [targetPath, ...pathParts].join('/');
    const exists = await this.filesService.exists(file, localFilePath);
    if (exists) {
      this.logger.debug(`File ${localFilePath} already exists`);
      return;
    }

    await this.ftpService.get(
      [sourcePath, ...pathParts].join('/'),
      [targetPath, ...pathParts].join('/'),
    );
  }

  private getPath(pathName: string) {
    return this.paths.find((path) => path.name === pathName);
  }
}
