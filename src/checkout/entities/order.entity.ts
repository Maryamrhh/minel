import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({nullable: false})
    userId: string;

    @Column({type: 'jsonb', array: false, default: () => "'[]'", nullable: false})    
    public items!: Array<{ item: string, price: number, number: number }>;

    @Column({nullable: false, default: 0})
    amount: number;

    @Column({nullable: false})
    firstName: string

    @Column({nullable: false})
    lastName: string

    @Column({nullable: false})
    address: string

    @Column({nullable: false})
    phoneNumber: string

    @Column({nullable: false})
    postalCode: string

    @Column({nullable: true})
    trackId: string;

    @Column({nullable: false, default: false})
    payment: boolean;
}
