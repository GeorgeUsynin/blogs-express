import { dbHelper, request, createErrorMessages, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { longShortDescription, longContent, longTitle, blogs, posts } from '../dataset';
import { CreateUpdatePostInputModel } from '../../features/posts/api/models';
import { mapToPostViewModel } from '../../features/posts/api/mappers';

describe('update post by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs, posts });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs', 'posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('updates post by id', async () => {
        const requestedId = (await dbHelper.getPost(2))._id;
        const updatedPost: CreateUpdatePostInputModel = {
            title: 'New title',
            blogId: blogs[1]._id.toString(),
            content: 'New content',
            shortDescription: 'New short description',
        };

        //updating post
        await request
            .put(`${ROUTES.POSTS}/${requestedId}`)
            .set(getAuthorization())
            .send(updatedPost)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the post was updated
        const { body } = await request.get(`${ROUTES.POSTS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            ...mapToPostViewModel(posts[2]),
            ...updatedPost,
        });
    });

    describe('post payload validation', () => {
        let requestedId: string;
        const blogId = blogs[1]._id.toString();

        beforeEach(async () => {
            requestedId = (await dbHelper.getPost(2))._id.toString();
        });

        describe('title', () => {
            it('returns 400 status code and proper error object if `title` is missing', async () => {
                //@ts-expect-error bad request (title is missing)
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    blogId,
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` type', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    //@ts-expect-error bad request (title type is invalid)
                    title: [],
                    blogId,
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` max length', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: longTitle,
                    blogId,
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['maxLength'] })).toEqual(body);
            });
        });

        describe('shortDescription', () => {
            it('returns 400 status code and proper error object if `shortDescription` is missing', async () => {
                //@ts-expect-error bad request (shortDescription is missing)
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId,
                    content: 'New content',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` type', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    //@ts-expect-error bad request (shortDescription type is invalid)
                    shortDescription: [],
                    blogId,
                    content: 'New content',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` max length', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    shortDescription: longShortDescription,
                    blogId,
                    content: 'New content',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['maxLength'] })).toEqual(body);
            });
        });

        describe('content', () => {
            it('returns 400 status code and proper error object if `content` is missing', async () => {
                //@ts-expect-error bad request (content is missing)
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId,
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` type', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId,
                    shortDescription: 'New short description',
                    //@ts-expect-error bad request (content type is invalid)
                    content: [],
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` max length', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId,
                    shortDescription: 'New short description',
                    content: longContent,
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['maxLength'] })).toEqual(body);
            });
        });

        describe('blogId', () => {
            it('returns 400 status code and proper error object if `blogId` is missing', async () => {
                //@ts-expect-error bad request (blogId is missing)
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `blogId` type', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    //@ts-expect-error bad request (blogId type is invalid)
                    blogId: [],
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `blogId` does not exist', async () => {
                const newUpdatedPost: CreateUpdatePostInputModel = {
                    title: 'New title',
                    blogId: '507f1f77bcf86cd799439011',
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .put(`${ROUTES.POSTS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(newUpdatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['blogIdNotExist'] })).toEqual(body);
            });
        });
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const requestedId = (await dbHelper.getPost(2))._id;
        const updatedPost: CreateUpdatePostInputModel = {
            title: 'New title',
            blogId: blogs[1]._id.toString(),
            content: 'New content',
            shortDescription: 'New short description',
        };

        await request
            .put(`${ROUTES.POSTS}/${requestedId}`)
            .send(updatedPost)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('return 404 status code if there is no post in database', async () => {
        const fakeRequestedId = '507f1f77bcf86cd799439011';
        const updatedPost: CreateUpdatePostInputModel = {
            title: 'New title',
            blogId: blogs[1]._id.toString(),
            content: 'New content',
            shortDescription: 'New short description',
        };

        await request
            .put(`${ROUTES.POSTS}/${fakeRequestedId}`)
            .set(getAuthorization())
            .send(updatedPost)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
