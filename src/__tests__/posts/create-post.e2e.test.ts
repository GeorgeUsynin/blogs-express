import { request, createErrorMessages, getAuthorization } from '../test-helpers';
import { setDB } from '../../db';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { dataset, longContent, longTitle, longShortDescription } from '../dataset';
import { CreateUpdatePostInputModel, PostViewModel } from '../../features/posts/models';

describe('create a post', () => {
    beforeEach(() => {
        setDB({ blogs: dataset.blogs, posts: [] });
    });

    it('creates a new post', async () => {
        const newPost: CreateUpdatePostInputModel = {
            title: 'New title',
            blogId: '2',
            content: 'New content',
            shortDescription: 'New short description',
        };

        const createdPost: PostViewModel = {
            id: expect.any(String),
            blogId: dataset.blogs.find(blog => blog.id === newPost.blogId)?.id as string,
            blogName: dataset.blogs.find(blog => blog.id === newPost.blogId)?.name as string,
            content: newPost.content,
            shortDescription: newPost.shortDescription,
            title: newPost.title,
        };

        //creating new post
        const { body: newPostBodyResponse } = await request
            .post(ROUTES.POSTS)
            .set(getAuthorization())
            .send(newPost)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(newPostBodyResponse).toEqual(createdPost);

        //checking that the post was created
        const { body: allPostsBodyResponse } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);

        expect(allPostsBodyResponse).toEqual([createdPost]);
    });

    describe('post payload validation', () => {
        describe('title', () => {
            it('returns 400 status code and proper error object if `title` is missing', async () => {
                //@ts-expect-error bad request (title is missing)
                const newPost: CreateUpdatePostInputModel = {
                    blogId: '2',
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` type', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    //@ts-expect-error bad request (title type is invalid)
                    title: [],
                    blogId: '2',
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` max length', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    title: longTitle,
                    blogId: '2',
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['maxLength'] })).toEqual(body);
            });
        });

        describe('shortDescription', () => {
            it('returns 400 status code and proper error object if `shortDescription` is missing', async () => {
                //@ts-expect-error bad request (shortDescription is missing)
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId: '2',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` type', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    //@ts-expect-error bad request (shortDescription type is invalid)
                    shortDescription: [],
                    blogId: '2',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` max length', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    shortDescription: longShortDescription,
                    blogId: '2',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['maxLength'] })).toEqual(body);
            });
        });

        describe('content', () => {
            it('returns 400 status code and proper error object if `content` is missing', async () => {
                //@ts-expect-error bad request (content is missing)
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId: '2',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` type', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId: '2',
                    shortDescription: 'New short description',
                    //@ts-expect-error bad request (content type is invalid)
                    content: [],
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` max length', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId: '2',
                    shortDescription: 'New short description',
                    content: longContent,
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['maxLength'] })).toEqual(body);
            });
        });

        describe('blogId', () => {
            it('returns 400 status code and proper error object if `blogId` is missing', async () => {
                //@ts-expect-error bad request (blogId is missing)
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `blogId` type', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    //@ts-expect-error bad request (blogId type is invalid)
                    blogId: [],
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `blogId` does not exist', async () => {
                const newPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId: '999',
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['blogIdNotExist'] })).toEqual(body);
            });
        });
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const newPost: CreateUpdatePostInputModel = {
            title: 'New title',
            blogId: '2',
            content: 'New content',
            shortDescription: 'New short description',
        };

        await request.post(ROUTES.POSTS).send(newPost).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
