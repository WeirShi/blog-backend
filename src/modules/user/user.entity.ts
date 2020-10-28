import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IsMobilePhone } from 'class-validator';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsMobilePhone('zh-CN')
  mobile: string;
	
	@Column()
	@Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
	}
	
	@Column()
	create_time: Date;

	@Column({
    default: null,
    onUpdate: 'Current_timestamp'
	})
	update_time: Date;

}
