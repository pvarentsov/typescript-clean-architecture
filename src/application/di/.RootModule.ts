import { AuthModule } from '@application/di/AuthModule';
import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { MediaModule } from '@application/di/MediaModule';
import { PostModule } from '@application/di/PostModule';
import { UserModule } from '@application/di/UserModule';
import { Module } from '@nestjs/common';

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
