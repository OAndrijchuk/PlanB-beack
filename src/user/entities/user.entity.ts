import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tokens } from '../../auth/entities/tokens.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'user', nullable: false })
  userName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false, select: false })
  password: string;

  @OneToOne(() => Tokens, tokens => tokens.userId, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'tokenId' })
  tokenId: Tokens;

  @Column({ default: false })
  isVerify: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({ default: '', select: false })
  verificationKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
