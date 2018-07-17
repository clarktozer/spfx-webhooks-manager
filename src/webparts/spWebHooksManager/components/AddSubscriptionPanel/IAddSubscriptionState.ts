export interface IAddSubscriptionState {
  expirationDateTime: Date;
  notificationUrl: string;
  clientState?: string;
  error: boolean;
}
