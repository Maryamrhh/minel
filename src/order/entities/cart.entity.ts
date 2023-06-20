import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({nullable: false})
    userId: string;

    @Column({nullable: false})
    itemId: string;
}
