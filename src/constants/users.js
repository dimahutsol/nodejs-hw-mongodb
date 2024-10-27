export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Checks if the string is a valid email address, starting with word characters, allowing optional dots or dashes, followed by "@" and a domain with 2-3 character extensions

export const accessTokenLifetime = 1000 * 60 * 15; // 15 minutes

export const refreshTokenLifetime = 1000 * 60 * 60 * 24 * 30; // 30 days
