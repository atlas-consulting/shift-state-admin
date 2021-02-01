import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Account } from "./Account";
import { EmailClientFilter } from "./EmailClientFilter";
import { EmailClientType } from "./EmailClientType";

@Entity({
  name: "email_clients",
})
export class EmailClient extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: "email_client_id",
  })
  id: number;

  @Column()
  alias: string;

  @Column({ name: "access_token", nullable: true })
  accessToken: string;

  @Column({ name: "refresh_token", nullable: true })
  refreshToken: string;

  /* -------------------------------- Relations ------------------------------- */

  @Column({ name: "account_id" })
  accountId: number;
  @ManyToOne(() => Account, (account) => account.emailClients)
  account: Account;

  @Column({ nullable: true, name: "email_client_type_id" })
  emailClientTypeId: number;
  @ManyToOne((type) => EmailClientType, (emailClientType) => emailClientType.id)
  @JoinColumn({ name: "email_client_type_id" })
  type: EmailClientType;

  @OneToMany(() => EmailClientFilter, (emailFilter) => emailFilter.emailClient)
  connectedFilters: EmailClientFilter[];
}
