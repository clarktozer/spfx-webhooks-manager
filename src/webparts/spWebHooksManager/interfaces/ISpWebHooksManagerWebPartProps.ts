import { QueryType } from "./QueryType";
import { DisplayMode } from "@microsoft/sp-core-library";

export interface ISpWebHooksManagerWebPartProps {
  listTemplateTypes: string[];
  title: string;
  queryType: QueryType;
  lists: string[];
  displayMode: DisplayMode;
}
