import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ArticleEntity } from '../article/article.entity';


@Entity('tag')
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    sort: number;

    @Column()
    color: string;

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
    
    @ManyToMany(() => ArticleEntity, article => article.tags)
    articles: ArticleEntity[];

}
