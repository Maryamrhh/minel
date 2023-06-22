import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Orders {
    @PrimaryColumn('uuid')
    id : string;

    @Column({nullable: false})
    userId: string;

    @Column({nullable: false, array: true})
    itemsId: string;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @Column({nullable: false})
    address: string;

    @Column({nullable: false})
    phoneNumber: string;

    @Column({nullable: false})
    postalCode: string;

    @Column({nullable: false})
    orderId: string;

    @Column({nullable: true})
    paymentId: string;

    @Column({nullable: true})
    paymentLink: string;

    @Column({default: true})
    active: boolean;
}
