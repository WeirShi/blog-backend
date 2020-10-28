import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto';
import { UserEntity } from './user.entity';
import { HTTP_USER_EXIST_TEXT } from 'src/constants/text.constant';
import { UserData } from 'src/interface/user.interface';

import * as argon2 from 'argon2';

const JWT = require('jsonwebtoken');
import { PRIVATE_KEY, EXPIRESD } from 'src/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}
    
    async findOne({ mobile, password }: UserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ mobile });
        if (!user) {
            return null;
        }
        if (await argon2.verify(user.password, password)) {
          return user;
        }
    
        return null;
    }

    async findById(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne(id);
        if (user) {
            return user;
        }
        return null;
    }


    async createOne({ mobile, password }: UserDto): Promise<UserData> {
        const user = await this.userRepository.findOne({ mobile });
        console.log('user', user);
        if (user) {
            throw new HttpException({ message: HTTP_USER_EXIST_TEXT }, HttpStatus.BAD_REQUEST);
        }

        const newUser = new UserEntity();
        newUser.mobile = mobile;
        newUser.password = password;
        newUser.create_time = new Date();

        console.log('newUser', newUser);
        const savedUser = await this.userRepository.save(newUser);
        console.log('savedUser', savedUser);
        return this.buildUserData(savedUser);
    }


    public generateToken(user: UserEntity): string {
        const token = JWT.sign({
            id: user.id,
            mobile: user.mobile
        }, PRIVATE_KEY, {
            expiresIn: EXPIRESD
        });
        return token;
    }


    private buildUserData(user: UserEntity): UserData {
        const userData = {
          id: user.id,
          mobile: user.mobile,
          token: this.generateToken(user),
        };
    
        return userData;
    }
}
