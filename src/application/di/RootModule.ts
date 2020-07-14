import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { MediaModule } from './MediaModule';
import { PostModule } from './PostModule';

@Module({
  imports: [
    InfrastructureModule,
    MediaModule,
    PostModule,
  ]
})
export class RootModule {}
