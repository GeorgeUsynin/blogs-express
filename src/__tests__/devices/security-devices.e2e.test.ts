import { HTTP_STATUS_CODES, ROUTES } from '../../core/constants';
import { CreateUserInputModel } from '../../features/users/api/models';
import { DeviceViewModel } from '../../features/devices/api/models';
import { dbHelper, getAuthorization, request } from '../test-helpers';

describe('security devices endpoints', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterEach(async () => {
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const createConfirmedUser = async (payload: CreateUserInputModel) => {
        await request.post(ROUTES.USERS).set(getAuthorization()).send(payload).expect(HTTP_STATUS_CODES.CREATED_201);
    };

    const loginAndGetRefreshCookie = async (loginOrEmail: string, password: string, userAgent: string) => {
        const response = await request
            .post(`${ROUTES.AUTH}/login`)
            .set('user-agent', userAgent)
            .send({ loginOrEmail, password })
            .expect(HTTP_STATUS_CODES.OK_200);

        const setCookie = response.headers['set-cookie'];
        if (!Array.isArray(setCookie) || setCookie.length === 0) {
            throw new Error('No refresh token cookie in login response');
        }

        return setCookie[0].split(';')[0];
    };

    const getSecurityDevices = (refreshCookie: string) => {
        return request.get(ROUTES.SECURITY_DEVICES).set('Cookie', refreshCookie);
    };

    it('returns 401 for GET /security/devices without refresh token cookie', async () => {
        await request.get(ROUTES.SECURITY_DEVICES).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns all active sessions for current user', async () => {
        const user: CreateUserInputModel = {
            login: 'devuser1',
            password: 'secret12',
            email: 'devices-user@example.com',
        };

        await createConfirmedUser(user);

        const cookieA = await loginAndGetRefreshCookie(user.login, user.password, 'Chrome Session A');
        await loginAndGetRefreshCookie(user.login, user.password, 'Firefox Session B');

        const { body } = await getSecurityDevices(cookieA).expect(HTTP_STATUS_CODES.OK_200);

        expect(Array.isArray(body)).toBe(true);
        expect(body).toHaveLength(2);
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }),
            ])
        );
    });

    it('deletes all sessions except current', async () => {
        const user: CreateUserInputModel = {
            login: 'devkeep1',
            password: 'secret12',
            email: 'devices-keep@example.com',
        };

        await createConfirmedUser(user);

        const currentCookie = await loginAndGetRefreshCookie(user.login, user.password, 'Current Session');
        const otherCookie = await loginAndGetRefreshCookie(user.login, user.password, 'Other Session');

        await request
            .delete(ROUTES.SECURITY_DEVICES)
            .set('Cookie', currentCookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body } = await getSecurityDevices(currentCookie).expect(HTTP_STATUS_CODES.OK_200);
        expect(body).toHaveLength(1);

        await request
            .post(`${ROUTES.AUTH}/refresh-token`)
            .set('Cookie', otherCookie)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        await request
            .post(`${ROUTES.AUTH}/refresh-token`)
            .set('Cookie', currentCookie)
            .expect(HTTP_STATUS_CODES.OK_200);
    });

    it('deletes current session by device id', async () => {
        const user: CreateUserInputModel = {
            login: 'devdel1',
            password: 'secret12',
            email: 'devices-delete@example.com',
        };

        await createConfirmedUser(user);

        const cookie = await loginAndGetRefreshCookie(user.login, user.password, 'Delete By Id Session');

        const { body } = await getSecurityDevices(cookie).expect(HTTP_STATUS_CODES.OK_200);
        expect(body).toHaveLength(1);

        await request
            .delete(`${ROUTES.SECURITY_DEVICES}/${body[0].deviceId}`)
            .set('Cookie', cookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        await getSecurityDevices(cookie).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 403 when trying to delete another user session', async () => {
        const userA: CreateUserInputModel = {
            login: 'devices_a',
            password: 'secret12',
            email: 'devices-a@example.com',
        };

        const userB: CreateUserInputModel = {
            login: 'devices_b',
            password: 'secret12',
            email: 'devices-b@example.com',
        };

        await createConfirmedUser(userA);
        await createConfirmedUser(userB);

        const cookieA = await loginAndGetRefreshCookie(userA.login, userA.password, 'Owner A Session');
        const cookieB = await loginAndGetRefreshCookie(userB.login, userB.password, 'Owner B Session');

        const { body } = await getSecurityDevices(cookieB).expect(HTTP_STATUS_CODES.OK_200);

        await request
            .delete(`${ROUTES.SECURITY_DEVICES}/${body[0].deviceId}`)
            .set('Cookie', cookieA)
            .expect(HTTP_STATUS_CODES.FORBIDDEN_403);
    });

    it('returns 400 for invalid device id format and 404 for missing device', async () => {
        const user: CreateUserInputModel = {
            login: 'deverr1',
            password: 'secret12',
            email: 'devices-errors@example.com',
        };

        await createConfirmedUser(user);

        const cookie = await loginAndGetRefreshCookie(user.login, user.password, 'Errors Session');

        const invalidIdResponse = await request
            .delete(`${ROUTES.SECURITY_DEVICES}/not-a-uuid`)
            .set('Cookie', cookie)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect(invalidIdResponse.body).toEqual({
            errorsMessages: [
                {
                    status: HTTP_STATUS_CODES.BAD_REQUEST_400,
                    field: 'id',
                    message: 'Incorrect format of UUID',
                },
            ],
        });

        const unknownDeviceId = '550e8400-e29b-41d4-a716-446655440000';
        await request
            .delete(`${ROUTES.SECURITY_DEVICES}/${unknownDeviceId}`)
            .set('Cookie', cookie)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('supports lifecycle operations across multiple devices and keeps current session active', async () => {
        const user: CreateUserInputModel = {
            login: 'devflow1',
            password: 'secret12',
            email: 'devices-flow@example.com',
        };

        await createConfirmedUser(user);

        const device1UserAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
        const device2UserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0';
        const device3UserAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15';
        const device4UserAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) OPR/110.0.0.0 Safari/537.36';

        let device1Cookie = await loginAndGetRefreshCookie(user.login, user.password, device1UserAgent);
        const device2Cookie = await loginAndGetRefreshCookie(user.login, user.password, device2UserAgent);
        const device3Cookie = await loginAndGetRefreshCookie(user.login, user.password, device3UserAgent);
        await loginAndGetRefreshCookie(user.login, user.password, device4UserAgent);

        const { body: devicesBeforeRefresh } = await getSecurityDevices(device1Cookie).expect(HTTP_STATUS_CODES.OK_200);
        const devicesBeforeRefreshTyped = devicesBeforeRefresh as DeviceViewModel[];
        expect(devicesBeforeRefresh).toHaveLength(4);

        const findDeviceByTitle = (devices: DeviceViewModel[], titlePrefix: string) =>
            devices.find(device => typeof device.title === 'string' && device.title.startsWith(titlePrefix));

        const device1Before = findDeviceByTitle(devicesBeforeRefreshTyped, 'Chrome');
        const device2Before = findDeviceByTitle(devicesBeforeRefreshTyped, 'Firefox');
        const device3Before = findDeviceByTitle(devicesBeforeRefreshTyped, 'Safari');
        const device4Before = findDeviceByTitle(devicesBeforeRefreshTyped, 'Opera');

        expect(device1Before).toBeDefined();
        expect(device2Before).toBeDefined();
        expect(device3Before).toBeDefined();
        expect(device4Before).toBeDefined();

        if (!device1Before || !device2Before || !device3Before || !device4Before) {
            throw new Error('Expected 4 devices with unique titles');
        }

        const idsBeforeRefresh = devicesBeforeRefreshTyped.map((device: DeviceViewModel) => device.deviceId).sort();

        // Wait 1s before refresh to avoid flaky timing:
        // if login and refresh happen within the same second, JWT iat can be identical,
        // and issuedAt/lastActiveDate may not change, causing intermittent test failures.
        await new Promise(resolve => setTimeout(resolve, 1000));

        const refreshResponse = await request
            .post(`${ROUTES.AUTH}/refresh-token`)
            .set('Cookie', device1Cookie)
            .expect(HTTP_STATUS_CODES.OK_200);
        const refreshSetCookie = refreshResponse.headers['set-cookie'];
        if (!Array.isArray(refreshSetCookie) || refreshSetCookie.length === 0) {
            throw new Error('No refresh token cookie in refresh-token response');
        }
        device1Cookie = refreshSetCookie[0].split(';')[0];

        const { body: devicesAfterRefresh } = await getSecurityDevices(device1Cookie).expect(HTTP_STATUS_CODES.OK_200);
        const devicesAfterRefreshTyped = devicesAfterRefresh as DeviceViewModel[];
        expect(devicesAfterRefresh).toHaveLength(4);

        const idsAfterRefresh = devicesAfterRefreshTyped.map((device: DeviceViewModel) => device.deviceId).sort();
        expect(idsAfterRefresh).toEqual(idsBeforeRefresh);

        const device1AfterRefresh = devicesAfterRefreshTyped.find(
            (device: DeviceViewModel) => device.deviceId === device1Before.deviceId
        );
        if (!device1AfterRefresh) {
            throw new Error('Updated device 1 was not found');
        }
        expect(device1AfterRefresh.lastActiveDate).not.toBe(device1Before.lastActiveDate);

        await request
            .delete(`${ROUTES.SECURITY_DEVICES}/${device2Before.deviceId}`)
            .set('Cookie', device1Cookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: devicesAfterDeleteDevice2 } = await getSecurityDevices(device1Cookie).expect(
            HTTP_STATUS_CODES.OK_200
        );
        const devicesAfterDeleteDevice2Typed = devicesAfterDeleteDevice2 as DeviceViewModel[];
        expect(devicesAfterDeleteDevice2).toHaveLength(3);
        expect(
            devicesAfterDeleteDevice2Typed.some((device: DeviceViewModel) => device.deviceId === device2Before.deviceId)
        ).toBe(false);

        await request
            .post(`${ROUTES.AUTH}/logout`)
            .set('Cookie', device3Cookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: devicesAfterLogoutDevice3 } = await getSecurityDevices(device1Cookie).expect(
            HTTP_STATUS_CODES.OK_200
        );
        const devicesAfterLogoutDevice3Typed = devicesAfterLogoutDevice3 as DeviceViewModel[];
        expect(devicesAfterLogoutDevice3).toHaveLength(2);
        expect(
            devicesAfterLogoutDevice3Typed.some((device: DeviceViewModel) => device.deviceId === device3Before.deviceId)
        ).toBe(false);

        await request
            .delete(ROUTES.SECURITY_DEVICES)
            .set('Cookie', device1Cookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: devicesAfterDeleteAllExceptCurrent } = await getSecurityDevices(device1Cookie).expect(
            HTTP_STATUS_CODES.OK_200
        );
        expect(devicesAfterDeleteAllExceptCurrent).toHaveLength(1);
        expect(devicesAfterDeleteAllExceptCurrent[0].deviceId).toBe(device1Before.deviceId);
    });
});
