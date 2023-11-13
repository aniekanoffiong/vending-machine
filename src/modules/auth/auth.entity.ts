import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ActiveLogin {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    uuid: string

    @Column()
    isActive: boolean
}
