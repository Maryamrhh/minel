import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({nullable: false})
    userId: string;

    @Column({nullable: false})
    itemId: string;

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string

    @Column({nullable: true})
    address: string

    @Column({nullable: true})
    phoneNumber: string

    @Column({nullable: true})
    postalCode: string

    @Column({nullable: true})
    orderId: number

    @Column({nullable: true})
    paymentId: string

    @Column({nullable: true})
    paymentLink: string

    @Column({default: false})
    active: boolean;
}
