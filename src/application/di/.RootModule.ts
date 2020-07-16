import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { MediaModule } from './MediaModule';
import { PostModule } from './PostModule';
import { UserModule } from './UserModule';
import { AuthModule } from './AuthModule';

@Module({
  imports: [
    InfrastructureModule,
    AuthModule,
    UserModule,
    MediaModule,
    PostModule,
  ]
})
export class RootModule {}
