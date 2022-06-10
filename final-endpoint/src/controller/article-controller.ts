import express, { Router } from 'express';
import { Request, Response } from 'express';
import Web from '../model/web';
import ArticleService from '../service/article-service';
import {
    CreateArticleRequest,
    CreateArticleResponse,
    CreateLikedArticleRequest,
    FetchArticlesRequest,
    GetArticleRequest,
    GetArticlesResponse,
    GetLikedRequest,
} from '../model/article';
import GeneralError from '../model/error';
import { auth } from './middleware';

class ArticleController {
    articleService: ArticleService;
    router: Router;

    constructor(articleService: ArticleService, router?: Router) {
        this.articleService = articleService;
        const r = router ?? express.Router();
        this.router = r;

        r.post('/api/article', auth, this.create);
        r.get('/api/articles', this.fetch);
        r.get('/api/article/:articleId', this.getArticle);

        r.get('/api/article/user/like', auth, this.fetchLiked);
        r.post('/api/article/like', auth, this.like);
        r.delete('/api/article/unlike', auth, this.unlike);
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

    fetchLiked = async (req: Request<{}, GetLikedRequest>, res: Response) => {
        const userId = parseInt(req.body.userId);
        try {
            const likedarticles = await this.articleService.fetchLiked(userId);
            res.json({
                success: true,
                data: likedarticles,
            });
        } catch (error) {
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

    like = async (req: Request<{}, CreateLikedArticleRequest>, res: Response) => {
        const articleId = parseInt(req.body.articleId);
        const userId = parseInt(req.body.userId);

        try {
            const article = await this.articleService.like(articleId, userId);
            res.status(200).json({
                success: true,
                data: article,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    unlike = async (req: Request<{}, CreateLikedArticleRequest>, res: Response) => {
        const articleId = parseInt(req.body.articleId);
        const userId = parseInt(req.body.userId);

        try {
            const article = await this.articleService.unlike(articleId, userId);
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
