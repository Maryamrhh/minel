import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  phoneNumber: string;
  @Column()
  tokenNumber: number;
}
