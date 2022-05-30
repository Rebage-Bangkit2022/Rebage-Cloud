export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        photo: string | null;
    };
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        photo: string | null;
    };
}

export interface TokenPayload {
    iat: number;
    exp: number;
    userId: number;
}