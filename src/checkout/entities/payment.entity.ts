import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryColumn('uuid')
    id: string;

    @Column({nullable: false})
    userId: string;

    @Column({nullable: false})
    paymentId: string;

    @Column({nullable: false})
    paymentLink: string;

    @Column({nullable: false})
    amount: number;

    @CreateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
    date: Date;

    @Column({nullable: true})
    trackId: string;

    @Column({nullable: true})
    cardNo: string;

    @Column({nullable: false, default: false})
    status: boolean;
}
