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

  @Column({ unique: true })
  alias: string;

  @Column({ name: "credential_token", nullable: true })
  credentialToken: string;

  @Column({ name: "credential_secret", nullable: true })
  credentialSecret: string;

  @Column({ name: "account_id" })
  accountId: number;
  @ManyToOne(() => Account, (account) => account.emailClients)
  account: Account;

  @Column({ nullable: true, name: "email_client_type_id" })
  emailClientTypeId: number;
  @OneToOne((type) => EmailClientType)
  @JoinColumn({ name: "email_client_type_id" })
  type: EmailClientType;

  @OneToMany(() => EmailClientFilter, (emailFilter) => emailFilter.emailClient)
  connectedFilters: Promise<EmailClientFilter[]>;
}
