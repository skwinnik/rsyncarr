import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { APP_CONFIG, IConfig } from '@/config/types';
import { NotificationService } from '@/notification/notification.service';
import { SyncCleanService } from '@/sync/sync-clean.service';
import { SyncCopyService } from '@/sync/sync-copy.service';

@Injectable()
export class SyncScheduleService {
  private readonly paths: IConfig['paths'];
  constructor(
    private readonly syncCopyService: SyncCopyService,
    private readonly syncCleanService: SyncCleanService,
    private readonly notificationService: NotificationService,
    @Inject(APP_CONFIG) config: IConfig,
  ) {
    this.paths = config.paths;
  }

  private copyMutex = false;
  @Cron('0 * * * * *')
  public async startCopy() {
    if (this.copyMutex) return;

    this.copyMutex = true;
    try {
      for (const path of this.paths) {
        await this.syncCopyService.copyRemote(path.name);
      }
    } catch (error) {
      await this.notificationService.error(error);
    } finally {
      this.copyMutex = false;
    }
  }

  private cleanMutex = false;
  @Cron('30 * * * * *')
  public async startClean() {
    if (this.cleanMutex) return;

    this.cleanMutex = true;
    try {
      for (const path of this.paths) {
        await this.syncCleanService.cleanLocal(path.name);
      }
    } catch (error) {
      await this.notificationService.error(error);
    } finally {
      this.cleanMutex = false;
    }
  }
}
