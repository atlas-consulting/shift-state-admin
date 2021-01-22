import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { IsEmail } from "class-validator";
import { EmailClientFilter } from "./EmailClientFilter";

@Entity({ name: "filters" })
export class Filter extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "filter_id" })
  id: number;

  @Column({ nullable: true })
  @IsEmail({})
  from: string;

  @Column()
  description: string;
  @OneToMany(
    () => EmailClientFilter,
    (emailClientFilter) => emailClientFilter.filter
  )
  connectedEmailClients: Promise<EmailClientFilter[]>;

  @CreateDateColumn({ type: "time with time zone", name: "created_at" })
  createdAt: Date;
}
