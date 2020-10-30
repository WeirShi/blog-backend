import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ArticleEntity } from '../article/article.entity';

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

    @ManyToMany(() => ArticleEntity, article => article.categories)
    articles: ArticleEntity[];

}
