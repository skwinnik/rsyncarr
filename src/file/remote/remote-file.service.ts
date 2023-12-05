import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { eachLimit } from 'async';
import sftp from 'ssh2-sftp-client';

import { IFile, IFileService } from '@/file/types';
import { FtpClient } from '@/ftp/ftp-client';
import { FtpClientFactory } from '@/ftp/ftp-client.factory';
import { FileFactory } from '@/lib/file.factory';

@Injectable()
export class RemoteFileService implements IFileService {
  private readonly requestLimit = 3;
  private readonly ftpClient: FtpClient;
  constructor(private readonly ftpClientFactory: FtpClientFactory) {
    this.ftpClient = ftpClientFactory.create();
  }

  public async traverse(parentFilePath: string): Promise<IFile[]> {
    const parentFileStat = await this.ftpClient.stat(parentFilePath);
    const parentFile: IFile = {
      name: path.basename(parentFilePath),
      fullPath: parentFilePath,
      type: this.getType(parentFileStat) as IFile['type'],
      size: parentFileStat.size,
    };

    return this._traverse(parentFile);
  }

  private async _traverse(parentFile: IFile): Promise<IFile[]> {
    if (parentFile.type !== 'd') {
      return [parentFile];
    }

    const children = (await this.ftpClient.list(parentFile.fullPath)).map(
      (ftpFile) =>
        FileFactory.fromSftp(
          path.join(parentFile.fullPath, ftpFile.name),
          ftpFile,
        ),
    );

    const files = children.filter((f) => f.type === '-');
    const folders = children.filter((f) => f.type === 'd');

    await eachLimit(folders, this.requestLimit, async (folder) => {
      const nestedFiles = await this._traverse(folder);
      files.push(...nestedFiles);
    });

    return files;
  }

  public async exists(file: IFile): Promise<boolean> {
    const stats = await this.ftpClient.stat(file.fullPath);
    return stats?.size === file.size;
  }

  private getType(stat: sftp.FileStats): IFile['type'] | undefined {
    if (stat.isDirectory) {
      return 'd';
    } else if (stat.isFile) {
      return '-';
    } else if (stat.isSymbolicLink) {
      return 'l';
    }

    return undefined;
  }

  delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
