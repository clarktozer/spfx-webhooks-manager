declare interface ISpWebHooksManagerWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DatePickerStrings: IDatePickerStrings;
  DeleteErrorTitle: string;
  AddErrorTitle: string;
  UpdateErrorTitle: string;
  Loading: string;
  EditSubscription: string;
  DeleteSubscription: string;
  EmptyTextField: string;
  ConfirmDelete: string;
  DeletingSubscription: string;
  HideSubscriptions: string;
  ExpandSubscriptions: string;
  AddSubscription: string;
  NoSubscriptions: string;
  UpdatingSubscription: string;
  SelectDate: string;
  ExpirationDate: string;
  AddMaxExpiration: string;
  ID: string;
  ClientState: string;
  Resource: string;
  NotificationUrl: string;
  OK: string;
  Cancel: string;
  AddingSubscription: string;
  Save: string;
  NotificationUrlError: string;
  ErrorUpdatingMessage: string;
  ErrorAddingMessage: string;
  ErrorDeletingMessage: string;
  ErrorFetchingSubscriptions: string;
  Subscription: string;
  SelectQueryType: string;
  List: string;
  Template: string;
  SelectList: string;
  ListTemplateTypes: string;
}

declare module 'SpWebHooksManagerWebPartStrings' {
  const strings: ISpWebHooksManagerWebPartStrings;
  export = strings;
}
