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
    liked?: Boolean;
}

export type GetArticleResponse = CreateArticleResponse;

export type GetArticlesResponse = Array<CreateArticleResponse>;

export interface FetchArticlesRequest {
    category?: string;
    garbagecategory?: string;
    page?: string;
    size?: string;
}
