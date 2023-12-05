import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { APP_CONFIG, IConfig } from '@/config/types';
import { SyncCleanService } from '@/sync/sync-clean.service';
import { SyncCopyService } from '@/sync/sync-copy.service';

@Injectable()
export class SyncScheduleService {
  private readonly paths: IConfig['paths'];
  constructor(
    private readonly syncCopyService: SyncCopyService,
    private readonly syncCleanService: SyncCleanService,
    @Inject(APP_CONFIG) config: IConfig,
  ) {
    this.paths = config.paths;
  }

  @Cron('0 * * * * *')
  public async startCopy() {
    const promises = this.paths.map((path) =>
      this.syncCopyService.copyRemote(path.name),
    );
    await Promise.all(promises);
  }

  @Cron('0 * * * * *')
  public async startClean() {
    const promises = this.paths.map((path) =>
      this.syncCleanService.cleanLocal(path.name),
    );
    await Promise.all(promises);
  }
}
