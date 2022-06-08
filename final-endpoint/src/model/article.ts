export interface CreateArticleRequest {
    title: string;
    author: string;
    source: string | null;
    body: string;
    category: string;
    garbagecategory: string;
    photo: string[];
}

export interface CreateArticleResponse {
    id: number;
    title: string;
    author: string;
    source: string | null;
    body: string;
    category: string;
    garbagecategory: string;
    photo: string[];
}

export interface CreateLikedArticleRequest {
    articleId: number;
    userId: number;
}

export interface CreateLikedArticleResponse {
    id: number;
    articleId: number;
    userId: number;
    title: string;
    name: string;
    message: string;
}

export type GetArticleResponse = CreateArticleResponse;

export type GetArticlesResponse = Array<CreateArticleResponse>;

export interface FetchArticlesRequest {
    category?: string;
    garbagecategory?: string;
    page?: string;
    size?: string;
}

export interface GetArticleRequest {
    articleId: string;
}

export interface GetLikedRequest {
    likeId: string;
}
