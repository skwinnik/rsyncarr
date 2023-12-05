import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';

import { IFile, IFileService } from '@/file/types';

@Injectable()
export class LocalFileService implements IFileService {
  public async exists(file: IFile): Promise<boolean> {
    try {
      const stat = await fs.promises.stat(path.join(file.fullPath));
      return stat.size === file.size;
    } catch (e) {
      return false;
    }
  }

  public async traverse(parentFilePath: string): Promise<IFile[]> {
    const parentFileStat = await fs.promises.stat(parentFilePath);
    const parentFile: IFile = {
      name: path.basename(parentFilePath),
      fullPath: parentFilePath,
      size: parentFileStat.size,
      type: this.getType(parentFileStat) as IFile['type'],
    };

    if (parentFile.type !== 'd') {
      return [parentFile];
    }

    const childFileNames = await fs.promises.readdir(parentFile.fullPath);
    const childFileStats = await Promise.all(
      childFileNames.map((childFile) =>
        fs.promises.stat(path.join(parentFile.fullPath, childFile)),
      ),
    );

    const children = childFileNames
      .filter((_, index) => this.getType(childFileStats[index]) !== undefined)
      .map((childFileName, index) => ({
        name: childFileName,
        type: this.getType(childFileStats[index]) as IFile['type'],
        fullPath: path.join(parentFile.fullPath, childFileName),
        size: childFileStats[index].size,
      }));

    const files = children.filter((f) => f.type === '-');
    const folders = children.filter((f) => f.type === 'd');

    for (const folder of folders) {
      const nestedFiles = await this.traverse(folder.fullPath);
      files.push(...nestedFiles);
    }

    return files;
  }

  private getType(stat: fs.Stats): IFile['type'] | undefined {
    if (stat.isDirectory()) {
      return 'd';
    } else if (stat.isFile()) {
      return '-';
    } else if (stat.isSymbolicLink()) {
      return 'l';
    }

    return undefined;
  }

  public async delete(file: IFile): Promise<void> {
    await fs.promises.rm(file.fullPath);
  }
}
