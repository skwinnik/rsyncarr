import * as fs from 'fs';

import { Injectable } from '@nestjs/common';

import { IFile } from '@/ftp/types';

@Injectable()
export class FilesService {
  public async exists(file: IFile, localFilePath: string): Promise<boolean> {
    try {
      const stat = await fs.promises.stat(localFilePath);
      return stat.size === file.size;
    } catch (e) {
      return false;
    }
  }
}
