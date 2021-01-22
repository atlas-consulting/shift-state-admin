import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Account } from "./Account";
import { EmailClientFilter } from "./EmailClientFilter";

@Entity({ name: "filters" })
export class Filter extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "filter_id" })
  id: number;

  @Column()
  description: string;

  @Column({
    name: "filter_configuration",
    type: "jsonb",
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  filterConfiguration: Record<string, unknown>;

  @CreateDateColumn({ type: "time with time zone", name: "created_at" })
  createdAt: Date;

  /* -------------------------------- Relations ------------------------------- */

  @Column({ name: "account_id" })
  accountId: number;
  @ManyToOne(() => Account, (account) => account.filters)
  account: Account;

  @OneToMany(
    () => EmailClientFilter,
    (emailClientFilter) => emailClientFilter.filter
  )
  connectedEmailClients: Promise<EmailClientFilter[]>;
}
