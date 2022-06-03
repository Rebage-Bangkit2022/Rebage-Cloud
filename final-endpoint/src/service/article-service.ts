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
} from '../model/article';
import { NotFound } from '../model/error';

const createArticleValidator = Joi.object<CreateArticleRequest>({
    title: Joi.string().required().min(6).max(128),
    author: Joi.string().required().min(3),
    source: Joi.string().required().min(6).max(64),
    body: Joi.string().required(),
    category: Joi.string().valid('reduce', 'reuse'),
    garbageCategory: Joi.array().valid(
        'botolplastik',
        'botolkaca',
        'kaleng',
        'kardus',
        'karet',
        'kertas',
        'plastik',
        'sedotan'
    ),
    photo: Joi.array().required(),
});

const getArticlesValidator = Joi.object<FetchArticlesRequest>({
    category: Joi.string().valid('reduce', 'reuse'),
    garbageCategory: Joi.array().valid(
        'botolplastik',
        'botolkaca',
        'kaleng',
        'kardus',
        'karet',
        'kertas',
        'plastik',
        'sedotan'
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

    like = async (articleId: number, userId: number): Promise<GetArticleResponse> => {
        const article = await this.articleRepository.findOne({ where: { id: articleId } });
        if (!article) throw new NotFound('Article not found');

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFound('User not found');

        const likedArticle = this.likedArticleRepository.create({ article, user });
        await this.likedArticleRepository.save(likedArticle);

        return article;
    };

    fetch = async (req: FetchArticlesRequest): Promise<GetArticlesResponse> => {
        const error = getArticlesValidator.validate(req).error;
        if (error) throw error;

        const category = req.category;
        const garbageCategory = req.garbageCategory;
        const page = !isNaN(parseInt(req.page!!)) ? parseInt(req.page!!) : 1;
        const size = !isNaN(parseInt(req.size!!)) ? parseInt(req.size!!) : 10;

        let selectQueryBuilder = this.articleRepository.createQueryBuilder('article');

        console.log(`PAGE ${page} SIZE ${size}`);

        if (category) {
            selectQueryBuilder = selectQueryBuilder.where('article.category = :category', { category: category });
        } else if (garbageCategory) {
            selectQueryBuilder = selectQueryBuilder.where('article.garbageCategory = :garbageCategory', {
                garbageCategory: garbageCategory,
            });
        }

        if (category && garbageCategory) {
            selectQueryBuilder = selectQueryBuilder.andWhere('article.garbageCategory = :garbageCategory', {
                garbageCategory: garbageCategory,
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

        const article = await this.articleRepository.findOne({ where: { id: articleId } });
        if (!article) throw new NotFound('Article not found');

        return article;
    };
}

export default ArticleService;
