export interface AuthData {

    email: string;
    password: string;
}

export interface ResponseAuthData{
    email: string;
    role: string;
    name: string;
    _token: string;
    _tokenExpirationDate: number;
}

export interface SignUpData {
    email: string;
    password: string;
    name: string;
}