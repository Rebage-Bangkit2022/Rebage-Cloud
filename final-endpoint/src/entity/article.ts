import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TimestampEntity from './entity-timestamp';
import User from './user';

export enum ArticleCategory {
    REDUCE = 'Reduce',
    REUSE = 'Reuse',
}

export enum GarbageCategory {
    BOTOLKACA = 'Botol Kaca',
    BOTOLPLASTIK = 'Botol Plastik',
    KALENG = 'Kaleng',
    KARDUS = 'Kardus',
    KARET = 'Karet',
    KERTAS = 'Kertas',
    PLASTIK = 'Plastik',
    SEDOTAN = 'Sedotan',
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
