import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }
    findAll() {
        return this.userRepository.find();
    }
    async create(user: User) {
        const userTmp = await this.userRepository.create(user);
        return this.userRepository.save(userTmp);
    }
    async update(id: number, user: Partial<User>) {
        return this.userRepository.update(id, user);
    }
    remove(id: number) {
        return this.userRepository.delete(id);
    }
    async getUsers() {
        const data = await this.userRepository.find();
        return {
            code: 0,
            data,
            msg: '用户列表请求成功'
        }
    }
}
