import {
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  Entity,
  BaseEntity,
} from "typeorm";
import { EmailClient } from "./EmailClient";
import { Filter } from "./Filter";

@Entity({ name: "email_client_filters" })
export class EmailClientFilter extends BaseEntity {
  @PrimaryColumn({ name: "email_client_id" })
  emailClientId: number;
  @PrimaryColumn({ name: "filter_id" })
  filterId: number;
  @ManyToOne(() => EmailClient, (emailClient) => emailClient.connectedFilters, {
    primary: true,
  })
  @JoinColumn({ name: "email_client_id" })
  emailClient: EmailClient;

  @ManyToOne(() => Filter, (filter) => filter.connectedEmailClients, {
    primary: true,
    eager: true,
  })
  @JoinColumn({ name: "filter_id" })
  filter: Filter;
}
