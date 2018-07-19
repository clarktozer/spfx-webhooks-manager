import { QueryType } from "./QueryType";

export interface ISpWebHooksManagerWebPartProps {
  listTemplateTypes: string[];
  title: string;
  queryType: QueryType;
  lists: string[];
}
