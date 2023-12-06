import { LogLevel } from '@nestjs/common';

export interface IConfig {
  logs: LogLevel[];
  auth: {
    host: string;
    port: number;
    username: string;
    password: string;
  };

  paths: {
    name: string;
    remotePath: string;
    localPath: string;
  }[];

  notification: {
    url: string;
  };
}

export const APP_CONFIG = Symbol('CONFIG');
