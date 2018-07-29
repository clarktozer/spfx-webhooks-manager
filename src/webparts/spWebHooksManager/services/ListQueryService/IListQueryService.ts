import { QueryType } from "../../interfaces/QueryType";

export default interface IListQueryService{
  generateListTemplateFilter(listTemplateTypes: string[]): string;
  generateListFilter(queryType: QueryType, listIds: string[], listTemplateTypes: string[]): string;
}
