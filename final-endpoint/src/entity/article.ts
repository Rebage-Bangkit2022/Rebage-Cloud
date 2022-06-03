import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import TimestampEntity from './entity-timestamp';
import User from './user';

export enum ArticleCategory {
    REDUCE = 'reduce',
    REUSE = 'reuse',
    RECYCLE = 'recycle',
}

export enum GarbageCategory {
    BOTOLKACA = 'botolkaca',
    BOTOLPLASTIK = 'botolplastik',
    KALENG = 'kaleng',
    KARDUS = 'kardus',
    KARET = 'karet',
    KERTAS = 'kertas',
    PLASTIK = 'plastik',
    SEDOTAN = 'sedotan',
}

@Entity('article')
class Article extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    title: string;

    @Column({ length: 255 })
    author: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    source!: string | null;

    @Column()
    body: string;

    @Column({ type: 'enum', enum: ArticleCategory })
    category: string;

    @Column({ type: 'enum', enum: GarbageCategory })
    garbagecategory: string;

    @Column({ type: 'simple-array', default: [] })
    photo: string[];

    @OneToMany(() => User, (user) => user.id)
    likedusers: User[];
}

export default Article;
