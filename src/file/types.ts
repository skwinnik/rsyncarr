export interface IFileService {
  traverse(filePath: string): Promise<IFile[]>;
  delete(file: IFile): Promise<void>;
  exists(file: IFile): Promise<boolean>;
}

export interface IFile {
  name: string;
  fullPath: string;
  type: 'd' | '-' | 'l';
  size: number;
}
