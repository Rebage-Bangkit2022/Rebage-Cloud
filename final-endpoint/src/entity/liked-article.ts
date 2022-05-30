import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Article from './article';
import TimestampEntity from './entity-timestamp';
import User from './user';

@Entity({ name: 'liked_article' })
@Index(['article.id', 'user.id'], { unique: true })
class LikedArticle extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, (article) => article.likedUsers, { eager: true })
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @ManyToOne(() => User, (user) => user.likedArticles)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

export default LikedArticle;