import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({nullable: false, unique: true})
    userId: string;

    @Column({type: 'jsonb', array: false, default: () => "'[]'", nullable: false})    
    public items!: Array<{ item: string, price: number, number: number }>;

    @Column({nullable: false, default: 0})
    amount: number;

}
