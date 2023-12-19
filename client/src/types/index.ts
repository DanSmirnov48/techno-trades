export type IUser = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    role: string;
};

export type INewUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
};