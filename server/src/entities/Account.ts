import {
  PrimaryGeneratedColumn,
  Entity,
  BaseEntity,
  Column,
  OneToMany,
} from "typeorm";
import { encryptString, doesMatchHash } from "../utils";
import { EmailClient } from "./EmailClient";

/* ---------------------------------- Types --------------------------------- */

interface Credentials {
  emailAddress: string;
  password: string;
}

/* ---------------------------------- Model --------------------------------- */

@Entity({ name: "accounts" })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "account_id" })
  id: number;
  @Column({ name: "email_address", unique: true })
  emailAddress: string;

  @Column({ name: "password" })
  password: string;

  @OneToMany((type) => EmailClient, (client) => client.account)
  emailClients: EmailClient[];

  static async new(credentials: Credentials): Promise<Account> {
    const account = new Account();
    account.emailAddress = credentials.emailAddress;
    const hashedPassword = await this.hashPassword(credentials.password);
    account.password = hashedPassword;
    return await account.save();
  }

  async isValidPassword(password: string) {
    return await doesMatchHash(password, this.password);
  }

  static async hashPassword(password: string) {
    const hash = await encryptString(password, 12);
    return hash;
  }
}
