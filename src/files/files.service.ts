import * as fs from 'fs';

import { Injectable } from '@nestjs/common';

import { IFile } from '@/ftp/types';

@Injectable()
export class FilesService {
  public async exists(file: IFile, localFilePath: string): Promise<boolean> {
    const fileExists = fs.existsSync(localFilePath);
    if (!fileExists) {
      return false;
    }

    const stats = fs.statSync(localFilePath);
    return stats.size === file.size;
  }
}
