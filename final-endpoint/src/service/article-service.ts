import Joi from 'joi';
import Article from '../entity/article';
import LikedArticle from '../entity/liked-article';
import User from '../entity/user';
import { Repository } from 'typeorm';
import {
    CreateArticleRequest,
    CreateArticleResponse,
    GetArticleResponse,
    FetchArticlesRequest,
    GetArticlesResponse,
    CreateLikedArticleResponse,
} from '../model/article';
import { NotFound } from '../model/error';

const createArticleValidator = Joi.object<CreateArticleRequest>({
    title: Joi.string().required().min(6).max(128),
    author: Joi.string().required().min(3),
    source: Joi.string().required().min(6).max(64),
    body: Joi.string().required(),
    category: Joi.string().valid('Reduce', 'Reuse'),
    garbagecategory: Joi.string().valid(
        'Botol Plastik',
        'Botol Kaca',
        'Kaleng',
        'Kardus',
        'Karet',
        'Kertas',
        'Plastik',
        'Sedotan'
    ),
    photo: Joi.array().required(),
});

const getArticlesValidator = Joi.object<FetchArticlesRequest>({
    category: Joi.string().valid('Reduce', 'Reuse'),
    garbagecategory: Joi.string().valid(
        'Botol Plastik',
        'Botol Kaca',
        'Kaleng',
        'Kardus',
        'Karet',
        'Kertas',
        'Plastik',
        'Sedotan'
    ),
    page: Joi.number(),
    size: Joi.number(),
});

const getArticleValidator = Joi.number().greater(0).positive();

class ArticleService {
    articleRepository: Repository<Article>;
    likedArticleRepository: Repository<LikedArticle>;
    userRepository: Repository<User>;

    constructor(
        articleRepository: Repository<Article>,
        likedArticleRepository: Repository<LikedArticle>,
        userRepository: Repository<User>
    ) {
        this.articleRepository = articleRepository;
        this.likedArticleRepository = likedArticleRepository;
        this.userRepository = userRepository;
    }

    create = async (req: CreateArticleRequest): Promise<CreateArticleResponse> => {
        const error = createArticleValidator.validate(req).error;
        if (error) throw error;

        const article = this.articleRepository.create(req);

        return await this.articleRepository.save(article);
    };

    like = async (articleId: number, userId: number): Promise<CreateLikedArticleResponse> => {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        });
        if (!article) throw new NotFound('Article not found');

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) throw new NotFound('User not found');

        const likedArticle = this.likedArticleRepository.create({
            article,
            user,
        });
        await this.likedArticleRepository.save(likedArticle);

        return {
            id: likedArticle.id,
            articleId,
            userId,
            title: article.title,
            name: user.name,
            message: 'Article "' + article.title + '" liked by "' + user.name + '"',
        };
    };

    unlike = async (articleId: number, userId: number): Promise<CreateLikedArticleResponse> => {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        });
        if (!article) throw new NotFound('Article not found');

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) throw new NotFound('User not found');

        const likedArticle = await this.likedArticleRepository.findOne({
            // where: { article, user },
        });
        if (!likedArticle) throw new NotFound('Liked article not found');

        await this.likedArticleRepository.delete(likedArticle.id);

        return {
            id: likedArticle.id,
            articleId,
            userId,
            title: likedArticle.article.title,
            name: likedArticle.user.name,
            message: 'Article "' + likedArticle.article.title + '" unliked by "' + likedArticle.user.name + '"',
        };
    };

    fetch = async (req: FetchArticlesRequest): Promise<GetArticlesResponse> => {
        const error = getArticlesValidator.validate(req).error;
        if (error) throw error;

        const category = req.category;
        const garbagecategory = req.garbagecategory;
        const page = !isNaN(parseInt(req.page!!)) ? parseInt(req.page!!) : 1;
        const size = !isNaN(parseInt(req.size!!)) ? parseInt(req.size!!) : 10;

        let selectQueryBuilder = this.articleRepository.createQueryBuilder('article');

        console.log(`PAGE ${page} SIZE ${size}`);

        if (category) {
            selectQueryBuilder = selectQueryBuilder.where('article.category = :category', { category: category });
        } else if (garbagecategory) {
            selectQueryBuilder = selectQueryBuilder.where('article.garbagecategory = :garbagecategory', {
                garbagecategory: garbagecategory,
            });
        }

        if (category && garbagecategory) {
            selectQueryBuilder = selectQueryBuilder.andWhere('article.garbagecategory = :garbagecategory', {
                garbagecategory: garbagecategory,
            });
        }

        selectQueryBuilder = selectQueryBuilder
            .skip((page - 1) * size)
            .take(size)
            .orderBy('article.created_at', 'DESC');

        return await selectQueryBuilder.getMany();
    };

    getArticle = async (articleId: number): Promise<GetArticleResponse> => {
        const error = getArticleValidator.validate(articleId).error;
        if (error) throw error;

        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        });
        if (!article) throw new NotFound('Article not found');

        return article;
    };
}

export default ArticleService;
