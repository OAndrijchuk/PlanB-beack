import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.tokenId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column({ default: '', nullable: false })
  refreshToken: string;

  @Column({ default: '', nullable: false })
  accessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
