import { CreateMediaUseCase } from '../../../../core/domain/media/usecase/CreateMediaUseCase';
import { RemoveMediaUseCase } from '../../../../core/domain/media/usecase/RemoveMediaUseCase';
import { GetMediaUseCase } from '../../../../core/domain/media/usecase/GetMediaUseCase';
import { GetMediaListUseCase } from '../../../../core/domain/media/usecase/GetMediaListUseCase';
import { EditMediaUseCase } from '../../../../core/domain/media/usecase/EditMediaUseCase';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, Req } from '@nestjs/common';
import { MediaDITokens } from '../../../../core/domain/media/di/MediaDITokens';
import { MediaUseCaseDto } from '../../../../core/domain/media/usecase/dto/MediaUseCaseDto';
import { EditMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/EditMediaAdapter';
import { GetMediaListAdapter } from '../../../../infrastructure/adapter/usecase/media/GetMediaListAdapter';
import { GetMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/GetMediaAdapter';
import { RemoveMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/RemoveMediaAdapter';
import * as Busboy from 'busboy';
import { Readable } from 'stream';
import { CreateMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/CreateMediaAdapter';
import { CoreApiResponse } from '../../../../core/common/api/CoreApiResponse';
import { UserRole } from '../../../../core/common/enums/UserEnums';
import { HttpAuth } from '../auth/decorator/HttpAuth';
import { HttpRequestWithUser, HttpUserPayload } from '../auth/type/HttpAuthTypes';
import { HttpRestApiModelCreateMediaQuery } from './documentation/media/HttpRestApiModelCreateMediaQuery';
import { Exception } from '../../../../core/common/exception/Exception';
import { Code } from '../../../../core/common/code/Code';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpRestApiModelCreateMediaBody } from './documentation/media/HttpRestApiModelCreateMediaBody';
import { HttpRestApiResponseMedia } from './documentation/media/HttpRestApiResponseMedia';
import { MediaType } from '../../../../core/common/enums/MediaEnums';
import { parse } from 'path';
import { HttpRestApiModelEditMediaBody } from './documentation/media/HttpRestApiModelEditMediaBody';
import { HttpUser } from '../auth/decorator/HttpUser';
import { HttpRestApiResponseMediaList } from './documentation/media/HttpRestApiResponseMediaList';
import IBusboy = busboy.Busboy;

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
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: HttpRestApiModelCreateMediaBody})
  @ApiQuery({name: 'name', type: 'string', required: false})
  @ApiQuery({name: 'type', enum: MediaType})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseMedia})
  public async createMedia(@Req() request: HttpRequestWithUser,
                           @Query() query: HttpRestApiModelCreateMediaQuery): Promise<CoreApiResponse<MediaUseCaseDto>> {
    
    return new Promise((resolve, reject): void => {
      const busboy: IBusboy = new Busboy({
        headers: request.headers,
        limits : {files: 1}
      });
      const fieldNames: string[] = [];
  
      busboy.on('file', async (fieldName: string, fileStream: Readable, fileName: string): Promise<void> => {
        try {
          fieldNames.push(fieldName);
          
          const adapter: CreateMediaAdapter = await CreateMediaAdapter.new({
            executorId: request.user.id,
            name      : query.name || parse(fileName).name,
            type      : query.type,
            file      : fileStream,
          });
  
          const createdMedia: MediaUseCaseDto = await this.createMediaUseCase.execute(adapter);
          resolve(CoreApiResponse.success(createdMedia));
      
        } catch (err) {
          
          fileStream.resume();
          reject(err);
        }
      });
  
      this.handleBusboyFinishEvent(busboy, fieldNames, reject);
      request.pipe(busboy);
    });
  }
  
  @Put(':mediaId')
  @HttpAuth(UserRole.ADMIN, UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({type: HttpRestApiModelEditMediaBody})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseMedia})
  public async editMedia(@HttpUser() user: HttpUserPayload,
                         @Body() body: HttpRestApiModelEditMediaBody,
                         @Param('mediaId') mediaId: string): Promise<CoreApiResponse<MediaUseCaseDto>> {
    
    const adapter: EditMediaAdapter = await EditMediaAdapter.new({
      mediaId    : mediaId,
      executorId : user.id,
      name       : body.name,
    });
    
    const editedMedia: MediaUseCaseDto = await this.editMediaUseCase.execute(adapter);
    
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
  
  private handleBusboyFinishEvent = (busboy: IBusboy, fieldNames: string[], reject: (err: Error) => void): void => {
    busboy.on('finish', (): void => {
      if (fieldNames.length === 0) {
        reject(Exception.new({code: Code.BAD_REQUEST_ERROR, overrideMessage: 'Request does not have file.'}));
      }
    });
  };
  
}
