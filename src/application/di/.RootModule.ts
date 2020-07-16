import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { MediaModule } from './MediaModule';
import { PostModule } from './PostModule';
import { UserModule } from './UserModule';

@Module({
  imports: [
    InfrastructureModule,
    MediaModule,
    PostModule,
    UserModule,
  ]
})
export class RootModule {}
