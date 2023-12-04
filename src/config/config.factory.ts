import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IConfig } from '@/config/types';

export class ConfigFactory {
  private static Logger = new Logger(ConfigFactory.name);

  public static get(configService: ConfigService): IConfig {
    const config = {
      logs:
        configService.get<string>('LOGS')?.split(',') ||
        configService.get<string[]>('logs'),
      auth: {
        host:
          configService.get<string>('AUTH_HOST') ||
          configService.get<string>('auth.host'),
        port:
          configService.get<number>('AUTH_PORT') ||
          configService.get<number>('auth.port'),
        username:
          configService.get<string>('AUTH_USERNAME') ||
          configService.get<string>('auth.username'),
        password:
          configService.get<string>('AUTH_PASSWORD') ||
          configService.get<string>('auth.password'),
      },
      paths: this.preparePaths(configService),
    } as IConfig;

    ConfigFactory.Logger.log(JSON.stringify(config, null, 2));

    return config;
  }

  private static preparePaths(configService: ConfigService): IConfig['paths'] {
    let paths: IConfig['paths'] | undefined =
      this.preparePathsEnv(configService);

    if (!paths) {
      paths = configService.get<IConfig['paths']>('paths');
    }

    if (!paths) {
      throw new Error('No paths to sync');
    }

    return paths;
  }

  private static preparePathsEnv(
    configService: ConfigService,
  ): IConfig['paths'] | undefined {
    const paths = configService.get<string>('PATHS');
    if (!paths) {
      return undefined;
    }

    return paths.split(',').map((path) => ({
      name: path.split(':')[0],
      sourcePath: path.split(':')[1],
      targetPath: path.split(':')[2],
    }));
  }
}
