import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { PostModule } from '@application/di/PostModule';
import { MediaModule } from '@application/di/MediaModule';
import { UserModule } from '@application/di/UserModule';
import { AuthModule } from '@application/di/AuthModule';

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
