import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import TimestampEntity from './entity-timestamp';
import User from './user';

@Entity({ name: 'detection' })
class Detection extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    label: string;

    @Column({ name: 'bounding_boxes', type: 'json', default: [] })
    boundingBoxes: number[][];

    @Column({ type: 'json', default: [] })
    scores: number[];

    @Column()
    total: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: number;
}

export default Detection;
