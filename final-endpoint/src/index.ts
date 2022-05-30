import express from 'express';
import { DataSource } from 'typeorm';
import Article from './entity/article';
import User from './entity/user';
import 'dotenv/config';
import UserService from './service/user-service';
import UserController from './controller/user-controller';
import ArticleService from './service/article-service';
import ArticleController from './controller/article-controller';
import DetectionController from './controller/detection-controller';
import morgan from 'morgan';
import LikedArticle from './entity/liked-article';
import Garbage from './entity/garbage';

const app = express();
const MODE = process.env.MODE === 'production' ? process.env.MODE : 'debug';
const PORT = process.env.PORT ?? 8080;

const appDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'bangkit',
    synchronize: true,
    logging: MODE === 'debug',
    entities: [User, Article, LikedArticle, Garbage],
    subscribers: [],
    migrations: [],
});

const main = async () => {
    const dataSource = await appDataSource.initialize();
    console.log(`Connected to ${appDataSource.options.type}`);

    const userRepository = dataSource.manager.getRepository(User);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const articleRepository = dataSource.manager.getRepository(Article);
    const likedArticleRepository = dataSource.manager.getRepository(LikedArticle)
    const articleService = new ArticleService(articleRepository, likedArticleRepository, userRepository);
    const articleController = new ArticleController(articleService);

    const detectionController = new DetectionController();

    app.use(morgan('combined'));
    app.use(express.json());
    app.use(userController.router);
    app.use(articleController.router);
    app.use(detectionController.router);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

main().catch((e) => {
    console.error(e);
});