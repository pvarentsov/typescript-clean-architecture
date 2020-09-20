import { HttpAuth } from '@application/api/http-rest/auth/decorator/HttpAuth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/HttpUser';
import { HttpRequestWithUser, HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { HttpRestApiModelCreateMediaBody } from '@application/api/http-rest/controller/documentation/media/HttpRestApiModelCreateMediaBody';
import { HttpRestApiModelCreateMediaQuery } from '@application/api/http-rest/controller/documentation/media/HttpRestApiModelCreateMediaQuery';
import { HttpRestApiModelEditMediaBody } from '@application/api/http-rest/controller/documentation/media/HttpRestApiModelEditMediaBody';
import { HttpRestApiResponseMedia } from '@application/api/http-rest/controller/documentation/media/HttpRestApiResponseMedia';
import { HttpRestApiResponseMediaList } from '@application/api/http-rest/controller/documentation/media/HttpRestApiResponseMediaList';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { MediaType } from '@core/common/enums/MediaEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { CreateMediaUseCase } from '@core/domain/media/usecase/CreateMediaUseCase';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { EditMediaUseCase } from '@core/domain/media/usecase/EditMediaUseCase';
import { GetMediaListUseCase } from '@core/domain/media/usecase/GetMediaListUseCase';
import { GetMediaUseCase } from '@core/domain/media/usecase/GetMediaUseCase';
import { RemoveMediaUseCase } from '@core/domain/media/usecase/RemoveMediaUseCase';
import { CreateMediaAdapter } from '@infrastructure/adapter/usecase/media/CreateMediaAdapter';
import { EditMediaAdapter } from '@infrastructure/adapter/usecase/media/EditMediaAdapter';
import { GetMediaAdapter } from '@infrastructure/adapter/usecase/media/GetMediaAdapter';
import { GetMediaListAdapter } from '@infrastructure/adapter/usecase/media/GetMediaListAdapter';
import { RemoveMediaAdapter } from '@infrastructure/adapter/usecase/media/RemoveMediaAdapter';
import { FileStorageConfig } from '@infrastructure/config/FileStorageConfig';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parse } from 'path';
import { resolve } from 'url';

@Controller('medias')
@ApiTags('medias')
export class MediaController {
  
  constructor(
    @Inject(MediaDITokens.CreateMediaUseCase)
    private readonly createMediaUseCase: CreateMediaUseCase,
    
    @Inject(MediaDITokens.EditMediaUseCase)
    private readonly editMediaUseCase: EditMediaUseCase,
    
    @Inject(MediaDITokens.GetMediaListUseCase)
    private readonly getMediaListUseCase: GetMediaListUseCase,
    
    @Inject(MediaDITokens.GetMediaUseCase)
    private readonly getMediaUseCase: GetMediaUseCase,
    
    @Inject(MediaDITokens.RemoveMediaUseCase)
    private readonly removeMediaUseCase: RemoveMediaUseCase,
  ) {}
  
  @Post()
  @HttpAuth(UserRole.ADMIN, UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: HttpRestApiModelCreateMediaBody})
  @ApiQuery({name: 'name', type: 'string', required: false})
  @ApiQuery({name: 'type', enum: MediaType})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseMedia})
  public async createMedia(
    @Req() request: HttpRequestWithUser,
    @UploadedFile() file: MulterFile,
    @Query() query: HttpRestApiModelCreateMediaQuery
    
  ): Promise<CoreApiResponse<MediaUseCaseDto>> {
  
    const adapter: CreateMediaAdapter = await CreateMediaAdapter.new({
      executorId: request.user.id,
      name      : query.name || parse(file.originalname).name,
      type      : query.type,
      file      : file.buffer,
    });
    
    const createdMedia: MediaUseCaseDto = await this.createMediaUseCase.execute(adapter);
    this.setFileStorageBasePath([createdMedia]);
    
    return CoreApiResponse.success(createdMedia);
  }
  
  @Put(':mediaId')
  @HttpAuth(UserRole.ADMIN, UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({type: HttpRestApiModelEditMediaBody})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseMedia})
  public async editMedia(
    @HttpUser() user: HttpUserPayload,
    @Body() body: HttpRestApiModelEditMediaBody,
    @Param('mediaId') mediaId: string
    
  ): Promise<CoreApiResponse<MediaUseCaseDto>> {
    
    const adapter: EditMediaAdapter = await EditMediaAdapter.new({
      mediaId    : mediaId,
      executorId : user.id,
      name       : body.name,
    });
    
    const editedMedia: MediaUseCaseDto = await this.editMediaUseCase.execute(adapter);
    this.setFileStorageBasePath([editedMedia]);
    
    return CoreApiResponse.success(editedMedia);
  }
  
  @Get()
  @HttpAuth(UserRole.ADMIN, UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseMediaList})
  public async getMediaList(@HttpUser() user: HttpUserPayload): Promise<CoreApiResponse<MediaUseCaseDto[]>> {
    const adapter: GetMediaListAdapter = await GetMediaListAdapter.new({executorId: user.id});
    const medias: MediaUseCaseDto[] = await this.getMediaListUseCase.execute(adapter);
    this.setFileStorageBasePath(medias);
    
    return CoreApiResponse.success(medias);
  }
  
  @Get(':mediaId')
  @HttpAuth(UserRole.ADMIN, UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseMedia})
  public async getMedia(@HttpUser() user: HttpUserPayload, @Param('mediaId') mediaId: string): Promise<CoreApiResponse<MediaUseCaseDto>> {
    const adapter: GetMediaAdapter = await GetMediaAdapter.new({executorId: user.id, mediaId: mediaId,});
    const media: MediaUseCaseDto = await this.getMediaUseCase.execute(adapter);
    this.setFileStorageBasePath([media]);
    
    return CoreApiResponse.success(media);
  }
  
  @Delete(':mediaId')
  @HttpAuth(UserRole.ADMIN, UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseMedia})
  public async removeMedia(@HttpUser() user: HttpUserPayload, @Param('mediaId') mediaId: string): Promise<CoreApiResponse<void>> {
    const adapter: RemoveMediaAdapter = await RemoveMediaAdapter.new({executorId: user.id, mediaId: mediaId,});
    await this.removeMediaUseCase.execute(adapter);
    
    return CoreApiResponse.success();
  }
  
  private setFileStorageBasePath(medias: MediaUseCaseDto[]): void {
    medias.forEach((media: MediaUseCaseDto) => media.url = resolve(FileStorageConfig.BASE_PATH, media.url));
  }
  
}

type MulterFile = { originalname: string, mimetype: string, size: number, buffer: Buffer };