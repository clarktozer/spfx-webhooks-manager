import { DisplayMode } from "@microsoft/sp-core-library";
import { QueryType } from "../interfaces/QueryType";

export interface ISpWebHooksManagerProps {
  showAdminButtons: boolean;
  listTemplateTypes: string[];
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  queryType: QueryType;
  lists: string[];
}
