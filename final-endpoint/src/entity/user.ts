import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Article from './article';
import Detection from './detection';
import TimestampEntity from './entity-timestamp';

@Entity('app_user')
class User extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({
        type: 'varchar',
        nullable: true,
        default: 'https://storage.googleapis.com/rebage-storage-us/user/profile-photo/rebage-default-avatar-r.png',
    })
    photo!: string | null;

    @OneToMany(() => Article, (article) => article.id)
    likedarticles: Article[];

    @OneToMany(() => Detection, (detection) => detection.user)
    detections: Detection[];
}

export default User;
