import { Inject, Injectable } from '@nestjs/common';

import { APP_CONFIG, IConfig } from '@/config/types';
import { IFile } from '@/file/types';

@Injectable()
export class NotificationService {
  private readonly url: string;
  constructor(@Inject(APP_CONFIG) config: IConfig) {
    this.url = config.notification.url;
  }

  public async startDownload(file: IFile): Promise<void> {
    await this._send(
      `🚛 Downloading\n🎥 ${file.name}\n💾 Size: ${this.toHumanSize(
        file.size,
      )}`,
    );
  }

  public async finishDownload(file: IFile): Promise<void> {
    await this._send(`🍿 Downloaded\n🎥 ${file.name}`);
  }

  public async cleaned(file: IFile): Promise<void> {
    await this._send(`🗑️ Removed\n🎥 ${file.name}`);
  }

  public async error(error: Error): Promise<void> {
    await this._send(`🔥 ${error.message}`);
  }

  private async _send(message: string): Promise<void> {
    await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });
  }

  private toHumanSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    while (size > 1024) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}
