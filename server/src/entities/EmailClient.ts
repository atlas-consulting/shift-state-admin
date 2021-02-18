import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Maybe } from "true-myth";
import { Account } from "./Account";
import { EmailClientFilter } from "./EmailClientFilter";
import { EmailClientType } from "./EmailClientType";
import { Filter } from "./Filter";
import { EmailProviderTypes } from "../services/email-provider/types";
import {
  GMAIL_CLIENT_TOKEN,
  MS_CLIENT_TOKEN,
} from "../routers/client-auth-urls/schema";

@Entity({
  name: "email_clients",
})
export class EmailClient extends BaseEntity {
  /* ------------------------------- Properties ------------------------------- */
  @PrimaryGeneratedColumn({
    name: "email_client_id",
  })
  id: number;

  @Column()
  alias: string;

  @Column({ name: "client_id", nullable: true })
  clientId: string;

  @Column({ name: "customer_id", nullable: true })
  customerId: string;

  @Column({ name: "client_email", nullable: true })
  clientEmail: string;

  @Column({ name: "client_secret", nullable: true })
  clientSecret: string;

  @Column({ nullable: true })
  domain: string;

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

  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */
  associateFilter(filter: Filter) {}
  static async addToken<T>(
    emailClientId: number,
    providerType: EmailProviderTypes,
    token: T
  ) {
    const emailClient = await EmailClient.findOne({
      id: emailClientId,
    });
    Maybe.fromNullable(emailClient).match({
      Just: async (emailClient) => {
        switch (providerType) {
          case "gmail":
            const {
              access_token,
              refresh_token,
            } = await GMAIL_CLIENT_TOKEN.validate(token);
            emailClient.accessToken = access_token;
            emailClient.refreshToken = refresh_token;
            await emailClient.save();
            break;
          case "office365":
            const { accessToken } = await MS_CLIENT_TOKEN.validate(token);
            emailClient.accessToken = accessToken;
            await emailClient.save();
        }
      },
      Nothing: () => {
        throw Error(`EmailClient of id ${emailClientId} not found`);
      },
    });
  }
}
