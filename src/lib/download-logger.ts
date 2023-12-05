import { Logger } from '@nestjs/common';

export class DownloadLogger {
  private readonly downloadLogger: Logger;
  private readonly reportInterval = 5000;
  private lastReport: number | null = null;

  constructor(localFilePath: string) {
    this.downloadLogger = new Logger(localFilePath);
  }

  start() {
    this.downloadLogger.log('Download started');
  }

  step(totalTransferred: number, chunk: number, total: number) {
    const now = Date.now();
    if (this.lastReport !== null && now - this.lastReport < this.reportInterval)
      return;

    this.lastReport = now;
    this.downloadLogger.log(
      `${this.toHumanReadable(totalTransferred)} / ${this.toHumanReadable(
        total,
      )} (${Math.round((totalTransferred / total) * 100)}%)`,
    );
  }

  done() {
    this.downloadLogger.log('Download finished');
  }

  private toHumanReadable(size: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    while (size > 1024) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}
