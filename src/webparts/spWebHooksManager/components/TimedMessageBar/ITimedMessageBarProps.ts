import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface ITimedMessageBarProps {
  text: string;
  type: MessageBarType;
  delay: number;
}
