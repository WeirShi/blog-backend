import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { TagEntity } from '../tag/tag.entity';
import { CategoryEntity } from '../category/category.entity';


@Entity('article')
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: '',
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci'
    })
    title: string;

    @Column({
        default: '',
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci'
    })
    content: string;

    @Column({
        default: ''
    })
    cover: string;

    @Column({
        default: 0
    })
    watch_times: number;

    @Column({
        default: 0
    })
    is_publish: number;

    @Column({
        default: 0
    })
    is_drafts: number;

    @Column({
        default: 0
    })
    is_delete: number;

    @Column({
        default: null
    })
    create_time: Date;

    @Column({
        default: null
    })
    update_time: Date;

    @Column({
        default: null
    })
    publish_time: Date;

    @ManyToMany(() => TagEntity, tag => tag.articles)
    @JoinTable()
    tags: TagEntity[];

    @ManyToMany(() => CategoryEntity, category => category.articles)
    @JoinTable()
    categories: CategoryEntity[];

}
