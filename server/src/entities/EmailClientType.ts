import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: "email_client_type",
})
export class EmailClientType extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: "email_client_type_id",
  })
  id: number;
  @Column({ unique: true })
  description: string;
}
