export type ProfileState = {
    loggedIn: boolean;
    token: string | null;
    name: string | null;
    roles: [string] | null;
    iat: number | null;
    iss: string | null;
    exp: number | null;
};
