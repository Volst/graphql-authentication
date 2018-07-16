import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id!: string;

  @Column() email!: string;

  @Column() password!: string;

  @Column() name!: string;

  @Column({ nullable: true })
  inviteToken!: string;

  @Column({ default: true })
  inviteAccepted!: boolean;

  @Column({ default: true })
  emailConfirmed!: boolean;

  @Column({ nullable: true })
  emailConfirmToken!: string;

  @Column({ nullable: true })
  resetToken!: string;

  @Column({ nullable: true })
  resetExpires!: Date;

  @Column({ nullable: true })
  deletedAt!: Date;

  @Column({ nullable: true })
  lastLogin!: Date;

  @Column() joinedAt!: Date;

  @Column({ default: false })
  isSuper!: boolean;
}
