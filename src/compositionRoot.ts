import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthController } from './features/auth/api/controller';
import {
    AuthService,
    JwtProvider,
    PasswordHasher,
    PasswordRecoveryService,
    RegistrationService,
} from './features/auth/application';
import { BlogsController } from './features/blogs/api/controller';
import { BlogsService } from './features/blogs/application';
import { BlogsRepository, BlogsQueryRepository } from './features/blogs/repository';
import { CommentsController } from './features/comments/api/controller';
import { CommentsService } from './features/comments/application';
import { CommentsRepository, CommentsQueryRepository } from './features/comments/repository';
import { DevicesController } from './features/devices/api/controller';
import { DevicesService } from './features/devices/application';
import { DevicesRepository, DevicesQueryRepository } from './features/devices/repository';
import { PostsController } from './features/posts/api/controller';
import { PostsService } from './features/posts/application';
import { PostsRepository, PostsQueryRepository } from './features/posts/repository';
import { UsersController } from './features/users/api/controller';
import { UsersService } from './features/users/application';
import { UsersRepository, UsersQueryRepository } from './features/users/repository';
import { ApiRateLimitRepository } from './features/apiRateLimit/repository';
import { ApiRateLimitService } from './features/apiRateLimit/application';
import { LikesRepository, LikesQueryRepository } from './features/likes/repository';
import { EmailAdapter } from './shared/adapters';
import { EmailManager } from './shared/managers';

export const container: Container = new Container();

container.bind(AuthController).toSelf();
container.bind(AuthService).toSelf();
container.bind(JwtProvider).toSelf();
container.bind(PasswordHasher).toSelf();
container.bind(RegistrationService).toSelf();
container.bind(PasswordRecoveryService).toSelf();

container.bind(BlogsController).toSelf();
container.bind(BlogsService).toSelf();
container.bind(BlogsRepository).toSelf();
container.bind(BlogsQueryRepository).toSelf();

container.bind(CommentsController).toSelf();
container.bind(CommentsService).toSelf();
container.bind(CommentsRepository).toSelf();
container.bind(CommentsQueryRepository).toSelf();

container.bind(DevicesController).toSelf();
container.bind(DevicesService).toSelf();
container.bind(DevicesRepository).toSelf();
container.bind(DevicesQueryRepository).toSelf();

container.bind(PostsController).toSelf();
container.bind(PostsService).toSelf();
container.bind(PostsRepository).toSelf();
container.bind(PostsQueryRepository).toSelf();

container.bind(UsersController).toSelf();
container.bind(UsersService).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(UsersQueryRepository).toSelf();

container.bind(ApiRateLimitRepository).toSelf();
container.bind(ApiRateLimitService).toSelf();

container.bind(LikesRepository).toSelf();
container.bind(LikesQueryRepository).toSelf();

container.bind(EmailAdapter).toSelf();
container.bind(EmailManager).toSelf();
