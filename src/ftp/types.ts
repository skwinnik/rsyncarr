export interface IFtpClientOptions {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface IFile {
  name: string;
  type: 'd' | '-' | 'l';
  size: number;
}
