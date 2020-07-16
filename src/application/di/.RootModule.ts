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
    MediaModule,
    PostModule,
    UserModule,
  ]
})
export class RootModule {}
