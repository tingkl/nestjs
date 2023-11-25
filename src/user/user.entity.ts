import { Logs } from "src/logs/logs.entity";
import { Roles } from "src/roles/roles.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from './profile.entity';
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    @Exclude()
    password: string;
    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile;
    @OneToMany(() => Logs, (logs) => logs.user)
    logs: Logs[];
    @ManyToMany(() => Roles, (roles) => roles.users)
    @JoinTable({ name: 'users_roles' })
    roles: Roles[];
}  