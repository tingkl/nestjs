import { Logs } from "src/logs/logs.entity";
import { Roles } from "src/roles/roles.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;
    @OneToMany(() => Logs, (logs) => logs.user)
    logs: Logs[];
    @ManyToMany(() => Roles, (roles) => roles.users)
    @JoinTable({ name: 'users_roles' })
    roles: Roles[];
}