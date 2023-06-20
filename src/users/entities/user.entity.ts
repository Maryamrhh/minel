import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ default: false })
  Active: boolean;

  @Column({nullable: false, default: 0})
  cart: number;
}
