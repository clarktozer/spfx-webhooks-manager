import { DisplayMode } from "../../../../node_modules/@microsoft/sp-core-library";

export interface ISpWebHooksManagerProps {
  showAdminButtons: boolean;
  listTemplateTypes: string[];
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
