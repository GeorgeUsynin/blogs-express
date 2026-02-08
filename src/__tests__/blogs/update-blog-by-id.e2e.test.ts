import { request, createErrorMessages, getAuthorization } from '../test-helpers';
import { setDB } from '../../db';
import { HTTP_STATUS_CODES, ROUTES } from '../../features/shared/constants';
import { dataset, longDescription, longWebsiteUrl } from '../dataset';
import { CreateUpdateBlogInputModel } from '../../features/blogs/models';

describe('update blog by id', () => {
    beforeEach(() => {
        setDB({ blogs: dataset.blogs, posts: [] });
    });

    const requestedId = '2';

    it('updates blog by id', async () => {
        const updatedBlog: CreateUpdateBlogInputModel = {
            description: 'New description',
            name: 'New name',
            websiteUrl: 'https://website.com',
        };

        //updating blog
        await request
            .put(`${ROUTES.BLOGS}/${requestedId}`)
            .set(getAuthorization())
            .send(updatedBlog)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        //checking that the blog was updated
        const { body } = await request.get(`${ROUTES.BLOGS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({ id: requestedId, ...updatedBlog });
    });

    describe('blog payload validation', () => {
        describe('name', () => {
            it('returns 400 status code and proper error object if `name` is missing', async () => {
                //@ts-expect-error bad request (name is missing)
                const updatedBlog: CreateUpdateBlogInputModel = {
                    description: 'New description',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `name` type', async () => {
                const updatedBlog: CreateUpdateBlogInputModel = {
                    //@ts-expect-error bad request (name type is invalid)
                    name: [],
                    description: 'New description',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `name` max length', async () => {
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'More than fifteen characters',
                    description: 'New description',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['maxLength'] })).toEqual(body);
            });
        });

        describe('description', () => {
            it('returns 400 status code and proper error object if `description` is missing', async () => {
                //@ts-expect-error bad request (description is missing)
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'New name',
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `description` type', async () => {
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'New name',
                    //@ts-expect-error bad request (description type is invalid)
                    description: [],
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `description` max length', async () => {
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'New name',
                    description: longDescription,
                    websiteUrl: 'https://website.com',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['maxLength'] })).toEqual(body);
            });
        });

        describe('websiteUrl', () => {
            it('returns 400 status code and proper error object if `websiteUrl` is missing', async () => {
                //@ts-expect-error bad request (websiteUrl is missing)
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'New name',
                    description: 'New description',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `websiteUrl` type', async () => {
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'New name',
                    description: 'New description',
                    //@ts-expect-error bad request (websiteUrl type is invalid)
                    websiteUrl: [],
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `websiteUrl` max length', async () => {
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'New name',
                    description: 'New description',
                    websiteUrl: longWebsiteUrl,
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['maxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for invalid `websiteUrl` format', async () => {
                const updatedBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: 'Eco lifestyle description',
                    websiteUrl: 'invalid-url',
                };
                const { body } = await request
                    .put(`${ROUTES.BLOGS}/${requestedId}`)
                    .set(getAuthorization())
                    .send(updatedBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isPattern'] })).toEqual(body);
            });
        });
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const updatedBlog: CreateUpdateBlogInputModel = {
            description: 'Eco lifestyle description',
            name: 'Eco Lifestyle',
            websiteUrl: 'https://ecolifestyle.com',
        };

        await request
            .put(`${ROUTES.BLOGS}/${requestedId}`)
            .send(updatedBlog)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('return 404 status code if there is no blog in database', async () => {
        const fakeRequestedId = '999';
        const updatedBlog: CreateUpdateBlogInputModel = {
            description: 'New description',
            name: 'New name',
            websiteUrl: 'https://ecolifestyle.com',
        };

        await request
            .put(`${ROUTES.BLOGS}/${fakeRequestedId}`)
            .set(getAuthorization())
            .send(updatedBlog)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
