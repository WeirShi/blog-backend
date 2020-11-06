import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { TagEntity } from '../tag/tag.entity';
import { CategoryEntity } from '../category/category.entity';


@Entity('article')
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: ''
    })
    title: string;

    @Column({
        default: ''
    })
    description: string;

    @Column({
        type: 'longtext'
    })
    content: string;

    @Column({
        type: 'longtext'
    })
    html_content: string;

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
    like_times: number;

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
