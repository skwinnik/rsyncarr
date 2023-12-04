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
    sourcePath: string;
    targetPath: string;
  }[];
}

export const APP_CONFIG = Symbol('CONFIG');
