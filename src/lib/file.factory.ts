import * as sftp from 'ssh2-sftp-client';

import { IFile } from '@/file/types';

export class FileFactory {
  static fromSftp(fullPath: string, sftpFile: sftp.FileInfo): IFile {
    return {
      name: sftpFile.name,
      type: sftpFile.type,
      size: sftpFile.size,
      fullPath: fullPath,
    };
  }
}
