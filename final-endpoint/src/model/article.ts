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

export type GetArticleResponse = CreateArticleResponse;

export type GetArticlesResponse = Array<CreateArticleResponse>;

export interface FetchArticlesRequest {
    category?: string;
    page?: string;
    size?: string;
}

export interface GetArticleRequest {
    articleId: string
}