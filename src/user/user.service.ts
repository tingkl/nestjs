import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindAll } from './user.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }
    findAll(query: FindAll) {
        const { limit, page, username, gender, roleId } = query;
        const take = limit || 10;
        return this.userRepository.find({
            select: {
                id: true,
                username: true,
                profile: {
                    gender: true
                }
            },
            relations: {
                logs: true,
                profile: true,
                roles: true
            },
            where: {
                username,
                profile: {
                    gender
                },
                roles: {
                    id: roleId
                }
            },
            take,
            skip: (page - 1) * take,
        });
    }
    find(username: string) {
        return this.userRepository.findOne({ where: { username }, relations: { roles: true } })
    }
    async create(user: Partial<User>) {
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
