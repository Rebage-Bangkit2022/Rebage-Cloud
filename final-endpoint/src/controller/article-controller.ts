import express, { Router } from 'express';
import { Request, Response } from 'express';
import Web from '../model/web';
import ArticleService from '../service/article-service';
import {
    CreateArticleRequest,
    CreateArticleResponse,
    FetchArticlesRequest,
    GetArticleRequest,
    GetArticlesResponse,
} from '../model/article';
import GeneralError from '../model/error';

class ArticleController {
    articleService: ArticleService;
    router: Router;

    constructor(articleService: ArticleService, router?: Router) {
        this.articleService = articleService;
        const r = router ?? express.Router();
        this.router = r;

        r.post('/api/article', this.create);
        r.get('/api/articles', this.fetch);
        r.get('/api/article/:articleId', this.getArticle);
    }

    create = async (req: Request<{}, {}, CreateArticleRequest>, res: Response<Web<CreateArticleResponse>>) => {
        try {
            const article = await this.articleService.create(req.body);
            res.status(201).json({
                success: true,
                data: article,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    fetch = async (req: Request<{}, {}, {}, FetchArticlesRequest>, res: Response<Web<GetArticlesResponse>>) => {
        const query = req.query;

        try {
            const article = await this.articleService.fetch(query);
            console.log('HASIL ' + article);
            res.status(200).json({
                success: true,
                data: article,
            });
        } catch (error) {
            console.log('HASIL ' + typeof error);
            GeneralError.handle(error, res);
        }
    };

    getArticle = async (req: Request<GetArticleRequest>, res: Response) => {
        const articleId = parseInt(req.params.articleId);
        try {
            const article = await this.articleService.getArticle(articleId);
            res.status(200).json({
                success: true,
                data: article,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };
}

export default ArticleController;
