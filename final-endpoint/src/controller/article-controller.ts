import express, { NextFunction, Router } from 'express';
import { Request, Response } from 'express';
import Web from '../model/web';
import ArticleService from '../service/article-service';
import { CreateArticleRequest, CreateArticleResponse, GetArticleResponse, GetArticlesResponse, LikeArticleRequest } from '../model/article';
import GeneralError, { Unathorized } from '../model/error';

class ArticleController {
    articleService: ArticleService;
    router: Router;

    constructor(articleService: ArticleService, router?: Router) {
        this.articleService = articleService;
        const r = router ?? express.Router();
        this.router = r;

        r.post('/api/article', this.create);
        r.get('/api/articles', this.fetch);
        r.post('/api/article/like', this.like);
        // r.get('/api/article/idlike', this.fetchOne);
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

    fetch = async (_req: Request, res: Response<Web<GetArticlesResponse>>) => {
        try {
            const article = await this.articleService.fetch();
            res.status(200).json({
                success: true,
                data: article,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    // Like article validate userId by JWT
    like = async (req: Request<{}, {}, LikeArticleRequest>, res: Response<Web<any>>) => {
        try {
            if (!req.body.userId) throw new Unathorized('Not allowed');
            const article = await this.articleService.like(req.body.articleId, req.body.userId);
            res.status(200).json({
                success: true,
                data: article,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    }
    
}

export default ArticleController;