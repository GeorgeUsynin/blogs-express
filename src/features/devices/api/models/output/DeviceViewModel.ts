export type DeviceViewModel = {
    /**
     * IP address of the device during sign-in
     */
    ip: string;

    /**
     * Device name (for example: "Chrome 105"),
     * received by parsing the HTTP "User-Agent" header
     */
    title: string;

    /**
     * Date of the last refresh/access token generation (ISO string)
     */
    lastActiveDate: string;

    /**
     * Unique identifier of the connected device session
     */
    deviceId: string;
};
