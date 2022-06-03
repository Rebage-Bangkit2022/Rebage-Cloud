export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    token: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    token: string;
}

export interface TokenPayload {
    iat: number;
    exp: number;
    userId: number;
}

export interface AuthGoogleRequest {
    idToken: string;
}

export interface AuthGoogleResponse {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    token: string;
}
