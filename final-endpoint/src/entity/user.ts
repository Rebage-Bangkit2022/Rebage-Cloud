import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Article from './article';
import TimestampEntity from './entity-timestamp';

@Entity('app_user')
class User extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({nullable: true})
    password: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    photo!: string | null;

    @OneToMany(() => Article, (article) => article.id)
    likedArticles: Article[];
}

export default User;
