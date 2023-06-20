import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    password: string;
  
    @Column({ unique: true, nullable: false })
    phoneNumber: string;
  
    @Column({nullable: false})
    tokenNumber: number;

    @Column({ default: false })
    Active: boolean;
}
