import { Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class TimestampEntity {
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export default TimestampEntity;
