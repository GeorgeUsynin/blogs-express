import { dbHelper, request, createErrorMessages, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { blogs, longContent, longTitle, longShortDescription } from '../dataset';
import { CreateUpdatePostInputModel } from '../../features/posts/models';

describe('create a post', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs', 'posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('creates a new post', async () => {
        const blogId = blogs[1]._id.toString();
        const newPost: CreateUpdatePostInputModel = {
            title: 'New title',
            blogId,
            content: 'New content',
            shortDescription: 'New short description',
        };

        //creating new post
        const { body: newPostBodyResponse } = await request
            .post(ROUTES.POSTS)
            .set(getAuthorization())
            .send(newPost)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(newPostBodyResponse).toEqual({
            id: expect.any(String),
            ...newPost,
            blogName: blogs[1].name,
            createdAt: expect.any(String),
        });

        //checking that the post was created
        const { body: allPostsBodyResponse } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);

        expect(allPostsBodyResponse).toEqual([newPostBodyResponse]);
    });

    describe('post payload validation', () => {
        const blogId = blogs[1]._id.toString();

        describe('title', () => {
            it('returns 400 status code and proper error object if `title` is missing', async () => {
                //@ts-expect-error bad request (title is missing)
                const newPost: CreateUpdatePostInputModel = {
                    blogId,
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
                    blogId,
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
                    blogId: '507f1f77bcf86cd799439011',
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
        const blogId = blogs[1]._id.toString();
        const newPost: CreateUpdatePostInputModel = {
            title: 'New title',
            blogId,
            content: 'New content',
            shortDescription: 'New short description',
        };

        await request.post(ROUTES.POSTS).send(newPost).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
