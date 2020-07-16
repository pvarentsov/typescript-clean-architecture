import { CreatePostUseCase } from '../../../../core/domain/post/usecase/CreatePostUseCase';
import { PublishPostUseCase } from '../../../../core/domain/post/usecase/PublishPostUseCase';
import { RemovePostUseCase } from '../../../../core/domain/post/usecase/RemovePostUseCase';
import { GetPostUseCase } from '../../../../core/domain/post/usecase/GetPostUseCase';
import { GetPostListUseCase } from '../../../../core/domain/post/usecase/GetPostListUseCase';
import { EditPostUseCase } from '../../../../core/domain/post/usecase/EditPostUseCase';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { PostDITokens } from '../../../../core/domain/post/di/PostDITokens';
import { PostUseCaseDto } from '../../../../core/domain/post/usecase/dto/PostUseCaseDto';
import { CreatePostAdapter } from '../../../../infrastructure/adapter/usecase/post/CreatePostAdapter';
import { EditPostAdapter } from '../../../../infrastructure/adapter/usecase/post/EditPostAdapter';
import { GetPostListAdapter } from '../../../../infrastructure/adapter/usecase/post/GetPostListAdapter';
import { GetPostAdapter } from '../../../../infrastructure/adapter/usecase/post/GetPostAdapter';
import { PublishPostAdapter } from '../../../../infrastructure/adapter/usecase/post/PublishPostAdapter';
import { RemovePostAdapter } from '../../../../infrastructure/adapter/usecase/post/RemovePostAdapter';
import { ApiResponse } from '../../../../core/common/api/ApiResponse';
import { UserRole } from '../../../../core/common/enums/UserEnums';
import { HttpUserPayload } from '../auth/type/HttpAuthTypes';
import { HttpUser } from '../auth/decorator/HttpUser';
import { HttpAuth } from '../auth/decorator/HttpAuth';

@Controller('posts')
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
  public async createPost(@HttpUser() user: HttpUserPayload, @Body() body: Record<string, string>): Promise<ApiResponse<PostUseCaseDto>> {
    const adapter: CreatePostAdapter = await CreatePostAdapter.new({
      executorId: user.id,
      title     : body.title,
      imageId   : body.imageId,
      content   : body.content,
    });
    
    const createdPost: PostUseCaseDto = await this.createPostUseCase.execute(adapter);
    
    return ApiResponse.success(createdPost);
  }
  
  @Put(':postId')
  public async editPost(@Body() body: Record<string, string>, @Param('postId') postId: string): Promise<ApiResponse<PostUseCaseDto>> {
    const adapter: EditPostAdapter = await EditPostAdapter.new({
      postId    : postId,
      executorId: body.executorId,
      title     : body.title,
      content   : body.content,
      imageId   : body.imageId,
    });
    
    const editedPost: PostUseCaseDto = await this.editPostUseCase.execute(adapter);
    
    return ApiResponse.success(editedPost);
  }
  
  @Get()
  public async getPostList(@Query() query: Record<string, string>): Promise<ApiResponse<PostUseCaseDto[]>> {
    const adapter: GetPostListAdapter = await GetPostListAdapter.new({
      executorId: query.executorId
    });
    
    const posts: PostUseCaseDto[] = await this.getPostListUseCase.execute(adapter);
    
    return ApiResponse.success(posts);
  }
  
  @Get(':postId')
  public async getPost(@Query() query: Record<string, string>, @Param('postId') postId: string): Promise<ApiResponse<PostUseCaseDto>> {
    const adapter: GetPostAdapter = await GetPostAdapter.new({
      executorId: query.executorId,
      postId    : postId,
    });
    
    const post: PostUseCaseDto = await this.getPostUseCase.execute(adapter);
    
    return ApiResponse.success(post);
  }
  
  @Post(':postId/publish')
  public async publishPost(@Body() body: Record<string, string>, @Param('postId') postId: string): Promise<ApiResponse<PostUseCaseDto>> {
    const adapter: PublishPostAdapter = await PublishPostAdapter.new({
      executorId: body.executorId,
      postId    : postId,
    });
    
    const post: PostUseCaseDto = await this.publishPostUseCase.execute(adapter);
    
    return ApiResponse.success(post);
  }
  
  @Delete(':postId')
  public async removePost(@Body() body: Record<string, string>, @Param('postId') postId: string): Promise<ApiResponse<void>> {
    const adapter: RemovePostAdapter = await RemovePostAdapter.new({
      executorId: body.executorId,
      postId    : postId,
    });
    
    await this.removePostUseCase.execute(adapter);
    
    return ApiResponse.success();
  }
  
}
