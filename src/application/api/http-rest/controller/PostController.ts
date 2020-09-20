import { HttpAuth } from '@application/api/http-rest/auth/decorator/HttpAuth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/HttpUser';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { HttpRestApiModelCreatePostBody } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelCreatePostBody';
import { HttpRestApiModelEditPostBody } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelEditPostBody';
import { HttpRestApiModelGetPostListQuery } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelGetPostListQuery';
import { HttpRestApiResponsePost } from '@application/api/http-rest/controller/documentation/post/HttpRestApiResponsePost';
import { HttpRestApiResponsePostList } from '@application/api/http-rest/controller/documentation/post/HttpRestApiResponsePostList';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { CreatePostUseCase } from '@core/domain/post/usecase/CreatePostUseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { EditPostUseCase } from '@core/domain/post/usecase/EditPostUseCase';
import { GetPostListUseCase } from '@core/domain/post/usecase/GetPostListUseCase';
import { GetPostUseCase } from '@core/domain/post/usecase/GetPostUseCase';
import { PublishPostUseCase } from '@core/domain/post/usecase/PublishPostUseCase';
import { RemovePostUseCase } from '@core/domain/post/usecase/RemovePostUseCase';
import { CreatePostAdapter } from '@infrastructure/adapter/usecase/post/CreatePostAdapter';
import { EditPostAdapter } from '@infrastructure/adapter/usecase/post/EditPostAdapter';
import { GetPostAdapter } from '@infrastructure/adapter/usecase/post/GetPostAdapter';
import { GetPostListAdapter } from '@infrastructure/adapter/usecase/post/GetPostListAdapter';
import { PublishPostAdapter } from '@infrastructure/adapter/usecase/post/PublishPostAdapter';
import { RemovePostAdapter } from '@infrastructure/adapter/usecase/post/RemovePostAdapter';
import { FileStorageConfig } from '@infrastructure/config/FileStorageConfig';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { resolve } from 'url';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  
  constructor(
    @Inject(PostDITokens.CreatePostUseCase)
    private readonly createPostUseCase: CreatePostUseCase,

    @Inject(PostDITokens.EditPostUseCase)
    private readonly editPostUseCase: EditPostUseCase,

    @Inject(PostDITokens.GetPostListUseCase)
    private readonly getPostListUseCase: GetPostListUseCase,

    @Inject(PostDITokens.GetPostUseCase)
    private readonly getPostUseCase: GetPostUseCase,

    @Inject(PostDITokens.PublishPostUseCase)
    private readonly publishPostUseCase: PublishPostUseCase,

    @Inject(PostDITokens.RemovePostUseCase)
    private readonly removePostUseCase: RemovePostUseCase,
  ) {}
  
  @Post()
  @HttpAuth(UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({type: HttpRestApiModelCreatePostBody})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponsePost})
  public async createPost(@HttpUser() user: HttpUserPayload, @Body() body: HttpRestApiModelCreatePostBody): Promise<CoreApiResponse<PostUseCaseDto>> {
    const adapter: CreatePostAdapter = await CreatePostAdapter.new({
      executorId: user.id,
      title     : body.title,
      imageId   : body.imageId,
      content   : body.content,
    });
    
    const createdPost: PostUseCaseDto = await this.createPostUseCase.execute(adapter);
    this.setFileStorageBasePath([createdPost]);
    
    return CoreApiResponse.success(createdPost);
  }
  
  @Put(':postId')
  @HttpAuth(UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({type: HttpRestApiModelEditPostBody})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponsePost})
  public async editPost(
    @HttpUser() user: HttpUserPayload,
    @Body() body: HttpRestApiModelCreatePostBody,
    @Param('postId') postId: string
    
  ): Promise<CoreApiResponse<PostUseCaseDto>> {
    
    const adapter: EditPostAdapter = await EditPostAdapter.new({
      executorId: user.id,
      postId    : postId,
      title     : body.title,
      content   : body.content,
      imageId   : body.imageId,
    });
    
    const editedPost: PostUseCaseDto = await this.editPostUseCase.execute(adapter);
    this.setFileStorageBasePath([editedPost]);
    
    return CoreApiResponse.success(editedPost);
  }
  
  @Get()
  @HttpAuth(UserRole.AUTHOR, UserRole.ADMIN, UserRole.GUEST)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiQuery({name: 'authorId', type: 'string', required: false})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponsePostList})
  public async getPostList(
    @HttpUser() user: HttpUserPayload,
    @Query() query: HttpRestApiModelGetPostListQuery
    
  ): Promise<CoreApiResponse<PostUseCaseDto[]>> {
    
    const adapter: GetPostListAdapter = await GetPostListAdapter.new({
      executorId: user.id,
      ownerId: query.authorId,
      status: PostStatus.PUBLISHED
    });
    const posts: PostUseCaseDto[] = await this.getPostListUseCase.execute(adapter);
    this.setFileStorageBasePath(posts);
    
    return CoreApiResponse.success(posts);
  }
  
  @Get('mine')
  @HttpAuth(UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponsePostList})
  public async getMinePostList(@HttpUser() user: HttpUserPayload): Promise<CoreApiResponse<PostUseCaseDto[]>> {
    const adapter: GetPostListAdapter = await GetPostListAdapter.new({
      executorId: user.id,
      ownerId: user.id,
    });
    const posts: PostUseCaseDto[] = await this.getPostListUseCase.execute(adapter);
    this.setFileStorageBasePath(posts);
    
    return CoreApiResponse.success(posts);
  }
  
  @Get(':postId')
  @HttpAuth(UserRole.AUTHOR, UserRole.ADMIN, UserRole.GUEST)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponsePostList})
  public async getPost(@HttpUser() user: HttpUserPayload, @Param('postId') postId: string): Promise<CoreApiResponse<PostUseCaseDto>> {
    const adapter: GetPostAdapter = await GetPostAdapter.new({executorId: user.id, postId: postId});
    const post: PostUseCaseDto = await this.getPostUseCase.execute(adapter);
    this.setFileStorageBasePath([post]);
    
    return CoreApiResponse.success(post);
  }
  
  @Post(':postId/publish')
  @HttpAuth(UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponsePostList})
  public async publishPost(@HttpUser() user: HttpUserPayload, @Param('postId') postId: string): Promise<CoreApiResponse<PostUseCaseDto>> {
    const adapter: PublishPostAdapter = await PublishPostAdapter.new({executorId: user.id, postId: postId});
    const post: PostUseCaseDto = await this.publishPostUseCase.execute(adapter);
    this.setFileStorageBasePath([post]);
    
    return CoreApiResponse.success(post);
  }
  
  @Delete(':postId')
  @HttpAuth(UserRole.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponsePostList})
  public async removePost(@HttpUser() user: HttpUserPayload, @Param('postId') postId: string): Promise<CoreApiResponse<void>> {
    const adapter: RemovePostAdapter = await RemovePostAdapter.new({executorId: user.id, postId: postId});
    await this.removePostUseCase.execute(adapter);
    
    return CoreApiResponse.success();
  }
  
  private setFileStorageBasePath(posts: PostUseCaseDto[]): void {
    posts.forEach((post: PostUseCaseDto) => {
      if (post.image) {
        post.image.url = resolve(FileStorageConfig.BASE_PATH, post.image.url);
      }
    });
  }
  
}
