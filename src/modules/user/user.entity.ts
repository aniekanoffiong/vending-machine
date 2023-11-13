import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import Role from '../../types/role.enum'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    deposit: number

    @Column()
    role: Role
}
