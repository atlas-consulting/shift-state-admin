import { EmailClient } from "../email-clients/types";

export interface Filter {
  id: number;
  description: string;
  filterConfiguration: Record<string, unknown>;
  createdAt: Date;
  connectedEmailClients: EmailClient[];
}
