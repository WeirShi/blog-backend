import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    sort: number;

    @Column({
        default: 0
    })
    is_delete: number;
    
    @Column()
    create_time: Date;

    @Column({
        default: null
    })
    update_time: Date;

}
