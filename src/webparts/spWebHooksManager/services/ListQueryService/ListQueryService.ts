import IListQueryService from "./IListQueryService";
import { QueryType } from "../../interfaces/QueryType";

export default class ListQueryService implements IListQueryService {
  public generateListFilter(queryType: QueryType, listIds: string[], listTemplateTypes: string[]): string {
    let listFilter = "Hidden eq false";
    if (queryType == QueryType.TEMPLATE) {
      if (listTemplateTypes != null && listTemplateTypes.length > 0) {
        listFilter += ` and ${this.generateListTemplateFilter(listTemplateTypes)}`;
      }
    } else if (queryType == QueryType.LIST && listIds.length > 0) {
      let map = listIds.map((e) => {
        return `Id eq guid'${e}'`;
      });
      listFilter += ` and (${map.join(" or ")})`;
    }
    return listFilter;
  }

  public generateListTemplateFilter(listTemplateTypes: string[]): string {
    let map = listTemplateTypes.map((e) => {
      return `BaseTemplate eq ${SP.ListTemplateType[e]}`;
    });
    return map.join(" or ");
  }
}
