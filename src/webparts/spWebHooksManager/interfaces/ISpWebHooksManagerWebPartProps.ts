import { QueryType } from "./QueryType";

export interface ISpWebHooksManagerWebPartProps {
  showAdminButtons: boolean;
  listTemplateTypes: string[];
  title: string;
  queryType: QueryType;
  lists: string[];
}
