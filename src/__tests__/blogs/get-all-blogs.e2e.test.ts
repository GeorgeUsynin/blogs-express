import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { blogs } from '../dataset';
import { mapToBlogViewModel } from '../../features/blogs/api/mappers';

describe('get all blogs', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('gets all available blogs', async () => {
        // checking if all blogs are in the database
        const { body } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: blogs.length,
            items: expect.arrayContaining(blogs.map(mapToBlogViewModel)),
        });
        expect(body.items).toHaveLength(blogs.length);
    });

    it('returns paginated and sorted blogs for query params', async () => {
        const expectedItems = [...blogs]
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(2, 4)
            .map(mapToBlogViewModel);

        const { body } = await request
            .get(ROUTES.BLOGS)
            .query({ sortBy: 'name', sortDirection: 'asc', pageNumber: 2, pageSize: 2 })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: blogs.length,
            items: expectedItems,
        });
    });

    it('filters blogs by searchNameTerm', async () => {
        const { body } = await request
            .get(ROUTES.BLOGS)
            .query({ searchNameTerm: 'tech' })
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [mapToBlogViewModel(blogs[1])],
        });
    });

    it('returns 400 for invalid query params', async () => {
        const { body } = await request
            .get(ROUTES.BLOGS)
            .query({ pageNumber: 0, sortDirection: 'invalid' })
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(body).toEqual({
            errorsMessages: expect.arrayContaining([
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'sortDirection',
                    message: expect.stringContaining('Sort direction must be one of'),
                },
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'pageNumber',
                    message: 'PageNumber field should be a positive number',
                },
            ]),
        });
    });
});
