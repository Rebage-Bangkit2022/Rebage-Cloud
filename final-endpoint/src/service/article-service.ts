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
    title: Joi.string().required().min(6).max(256),
    author: Joi.string().required().min(3),
    source: Joi.string().required().min(6).max(256),
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

const getArticleValidator = Joi.object({
    articleId: Joi.number().greater(0).positive().required(),
    userId: Joi.number().greater(0).positive().optional(),
});

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
        await this.likedArticleRepository.upsert(likedArticle, {
            skipUpdateIfNoValuesChanged: true,
            conflictPaths: ['user', 'article'],
        });

        return {
            ...article,
            liked: true,
        };
    };

    unlike = async (articleId: number, userId: number): Promise<GetArticleResponse> => {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        });
        if (!article) throw new NotFound('Article not found');

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) throw new NotFound('User not found');

        const likedArticle = await this.likedArticleRepository.findOne({
            where: {
                article: { id: article.id },
                user: { id: user.id },
            },
        });
        if (!likedArticle)
            return {
                ...article,
                liked: false,
            };

        await this.likedArticleRepository.delete({ id: likedArticle.id });

        return {
            ...article,
            liked: false,
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

    fetchLiked = async (userId: number): Promise<GetArticleResponse[]> => {
        const likedarticles = await this.likedArticleRepository
            .createQueryBuilder('liked_article')
            .leftJoinAndSelect('liked_article.article', 'article')
            .leftJoinAndSelect('liked_article.user', 'user')
            .where('liked_article.user.id = :userId', { userId: userId })
            .getMany();

        return likedarticles.map((v) => ({ ...v.article, liked: true }));
    };

    getArticle = async (articleId: number, userId?: number): Promise<GetArticleResponse> => {
        const error = getArticleValidator.validate({ articleId, userId }).error;
        if (error) throw error;

        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        });
        if (!article) throw new NotFound('Article not found');

        if (!userId) {
            return {
                ...article,
                liked: false,
            };
        }

        const liked = await this.likedArticleRepository.findOne({
            where: { article: { id: articleId }, user: { id: userId } },
        });

        return {
            ...article,
            liked: liked != null,
        };
    };
}

export default ArticleService;
