import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { APP_CONFIG, IConfig } from '@/config/types';
import { SyncService } from '@/sync/sync.service';

@Injectable()
export class SyncScheduleService {
  private readonly paths: IConfig['paths'];
  constructor(
    private readonly syncService: SyncService,
    @Inject(APP_CONFIG) config: IConfig,
  ) {
    this.paths = config.paths;
  }

  @Cron('* * * * * *')
  public async startSync() {
    const promises = this.paths.map((path) => this.syncService.sync(path.name));
    await Promise.all(promises);
  }
}
