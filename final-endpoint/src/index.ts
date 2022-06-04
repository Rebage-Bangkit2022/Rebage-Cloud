import express from "express";
import { DataSource } from "typeorm";
import Article from "./entity/article";
import User from "./entity/user";
import "dotenv/config";
import UserService from "./service/user-service";
import UserController from "./controller/user-controller";
import ArticleService from "./service/article-service";
import ArticleController from "./controller/article-controller";
import DetectionController from "./controller/detection-controller";
import morgan from "morgan";
import LikedArticle from "./entity/liked-article";
import Garbage from "./entity/garbage";
import GarbageService from "./service/garbage-service";
import GarbageController from "./controller/garbage-controller";
import Detection from "./entity/detection";
import DetectionService from "./service/detection-service";

const app = express();
const MODE = process.env.MODE === "production" ? process.env.MODE : "debug";
const PORT = isNaN(parseInt(process.env.PORT!!)) ? 8080 : parseInt(process.env.PORT!!);

const appDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: MODE === "debug",
  entities: [User, Article, LikedArticle, Garbage, Detection],
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
  const likedArticleRepository = dataSource.manager.getRepository(LikedArticle);
  const articleService = new ArticleService(articleRepository, likedArticleRepository, userRepository);
  const articleController = new ArticleController(articleService);

  const garbageRepository = dataSource.manager.getRepository(Garbage);
  const garbageService = new GarbageService(garbageRepository);
  const garbageController = new GarbageController(garbageService);

  const detectionRepository = dataSource.manager.getRepository(Detection)
  const detectionService = new DetectionService(detectionRepository, userRepository)
  const detectionController = new DetectionController(detectionService);

  app.use(morgan("combined"));
  app.use(express.json());
  app.use(userController.router);
  app.use(articleController.router);
  app.use(detectionController.router);
  app.use(garbageController.router);

  console.log(PORT);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main().catch((e) => {
  console.error(e);
});
