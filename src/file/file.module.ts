import { Module } from '@nestjs/common';

import { LocalFileModule } from '@/file/local/local-file.module';
import { RemoteFileModule } from '@/file/remote/remote-file.module';

@Module({
  imports: [RemoteFileModule, LocalFileModule],
  exports: [RemoteFileModule, LocalFileModule],
})
export class FileModule {}
