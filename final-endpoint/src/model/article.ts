export interface CreateArticleRequest {
    title: string;

    author: string;

    source: string | null;

    body: string;

    category: string;

    garbageCategory: string[];

    photo: string[];
}

export interface CreateArticleResponse {
    id: number;

    title: string;

    author: string;

    source: string | null;

    body: string;

    category: string;

    garbageCategory: string[];

    photo: string[];
}

export type GetArticleResponse = CreateArticleResponse;

export type GetArticlesResponse = Array<CreateArticleResponse>;

export interface FetchArticlesRequest {
    category?: string;
    garbageCategory?: string;
    page?: string;
    size?: string;
}

export interface GetArticleRequest {
    articleId: string;
}
