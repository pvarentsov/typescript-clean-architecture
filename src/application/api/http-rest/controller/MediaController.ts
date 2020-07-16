import { CreateMediaUseCase } from '../../../../core/domain/media/usecase/CreateMediaUseCase';
import { RemoveMediaUseCase } from '../../../../core/domain/media/usecase/RemoveMediaUseCase';
import { GetMediaUseCase } from '../../../../core/domain/media/usecase/GetMediaUseCase';
import { GetMediaListUseCase } from '../../../../core/domain/media/usecase/GetMediaListUseCase';
import { EditMediaUseCase } from '../../../../core/domain/media/usecase/EditMediaUseCase';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req } from '@nestjs/common';
import { MediaDITokens } from '../../../../core/domain/media/di/MediaDITokens';
import { MediaUseCaseDto } from '../../../../core/domain/media/usecase/dto/MediaUseCaseDto';
import { EditMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/EditMediaAdapter';
import { GetMediaListAdapter } from '../../../../infrastructure/adapter/usecase/media/GetMediaListAdapter';
import { GetMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/GetMediaAdapter';
import { RemoveMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/RemoveMediaAdapter';
import * as Busboy from 'busboy';
import { Request } from 'express';
import { Readable } from 'stream';
import { CreateMediaAdapter } from '../../../../infrastructure/adapter/usecase/media/CreateMediaAdapter';
import { MediaType } from '../../../../core/common/enums/MediaEnums';
import { ApiResponse } from '../../../../core/common/api/ApiResponse';
import { HttpRoles } from '../auth/decorator/HttpRoles';
import { UserRole } from '../../../../core/common/enums/UserEnums';
import IBusboy = busboy.Busboy;

@Controller('medias')
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
  @HttpRoles(UserRole.ADMIN, UserRole.AUTHOR, UserRole.GUEST)
  public async createMedia(@Req() request: Request): Promise<ApiResponse<MediaUseCaseDto>> {
    return new Promise((resolve, reject): void => {
      const busboy: IBusboy      = new Busboy({
        headers: request.headers,
        limits : {files: 1}
      });
      const fieldNames: string[] = [];
  
      busboy.on('file', async (fieldName: string, fileInputStream: Readable): Promise<void> => {
        try {
          fieldNames.push(fieldName);
          
          const adapter: CreateMediaAdapter = await CreateMediaAdapter.new({
            executorId: request.query.executorId as string,
            name      : request.query.name as string,
            type      : request.query.type as MediaType,
            file      : fileInputStream,
          });
  
          const createdMedia: MediaUseCaseDto = await this.createMediaUseCase.execute(adapter);
          resolve(ApiResponse.success(createdMedia));
      
        } catch (err) {
          
          fileInputStream.resume();
          reject(err);
        }
      });
  
      this.handleBusboyFinishEvent(busboy, fieldNames, reject);
      request.pipe(busboy);
    });
  }
  
  @Put(':mediaId')
  @HttpRoles(UserRole.ADMIN, UserRole.AUTHOR, UserRole.GUEST)
  public async editMedia(@Body() body: Record<string, string>, @Param('mediaId') mediaId: string): Promise<ApiResponse<MediaUseCaseDto>> {
    const adapter: EditMediaAdapter = await EditMediaAdapter.new({
      mediaId    : mediaId,
      executorId : body.executorId,
      name       : body.name,
    });
    
    const editedMedia: MediaUseCaseDto = await this.editMediaUseCase.execute(adapter);
    
    return ApiResponse.success(editedMedia);
  }
  
  @Get()
  @HttpRoles(UserRole.ADMIN, UserRole.AUTHOR, UserRole.GUEST)
  public async getMediaList(@Query() query: Record<string, string>): Promise<ApiResponse<MediaUseCaseDto[]>> {
    const adapter: GetMediaListAdapter = await GetMediaListAdapter.new({
      executorId: query.executorId
    });
    
    const medias: MediaUseCaseDto[] = await this.getMediaListUseCase.execute(adapter);
    
    return ApiResponse.success(medias);
  }
  
  @Get(':mediaId')
  @HttpRoles(UserRole.ADMIN, UserRole.AUTHOR, UserRole.GUEST)
  public async getMedia(@Query() query: Record<string, string>, @Param('mediaId') mediaId: string): Promise<ApiResponse<MediaUseCaseDto>> {
    const adapter: GetMediaAdapter = await GetMediaAdapter.new({
      executorId: query.executorId,
      mediaId    : mediaId,
    });
    
    const media: MediaUseCaseDto = await this.getMediaUseCase.execute(adapter);
    
    return ApiResponse.success(media);
  }
  
  @Delete(':mediaId')
  @HttpRoles(UserRole.ADMIN, UserRole.AUTHOR, UserRole.GUEST)
  public async removeMedia(@Body() body: Record<string, string>, @Param('mediaId') mediaId: string): Promise<ApiResponse<void>> {
    const adapter: RemoveMediaAdapter = await RemoveMediaAdapter.new({
      executorId: body.executorId,
      mediaId    : mediaId,
    });
    
    await this.removeMediaUseCase.execute(adapter);
    
    return ApiResponse.success();
  }
  
  private handleBusboyFinishEvent = (
    busboy: IBusboy,
    fieldNames: string[],
    reject: (err: Error) => void
  
  ): void => {
    
    busboy.on('finish', (): void => {
      if (fieldNames.length === 0) {
        reject(new Error('Request does not have any files'));
      }
    });
  };
  
}
