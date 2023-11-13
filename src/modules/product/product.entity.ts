import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amountAvailable: number

    @Column()
    cost: number

    @Column()
    productName: string

    @Column()
    sellerId: number

}
