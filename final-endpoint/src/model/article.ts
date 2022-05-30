export interface CreateArticleRequest {
    title: string;

    author: string;

    source: string | null;

    body: string;

    category: string;

    photo: string[];
}

export interface CreateArticleResponse {
    id: number;

    title: string;

    author: string;

    source: string | null;

    body: string;

    category: string;

    photo: string[];
}

export interface LikeArticleRequest {
    articleId: number;

    userId: number;
}

export type GetArticleResponse = CreateArticleResponse;

export type GetArticlesResponse = Array<CreateArticleResponse>;