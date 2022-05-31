import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import TimestampEntity from './entity-timestamp';

@Entity({ name: 'garbage' })
class Garbage extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'numeric' })
    price: number;

    @Column()
    image: string;
}

export default Garbage;
