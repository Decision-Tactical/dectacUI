export class Login {
    userdetaildvocollection!: {
        id: string;
        username?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        token?: string;
    }[]; // This defines an array of objects

    errorinfodvocollection!: {
        error?: string;
    }[]; // This defines an array of objects
}
