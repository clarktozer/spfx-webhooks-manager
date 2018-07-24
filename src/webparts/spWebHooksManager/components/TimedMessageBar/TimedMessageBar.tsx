import * as React from 'react';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { ITimedMessageBarProps } from './ITimedMessageBarProps';
import { ITimedMessageBarState } from './ITimedMessageBarState';

export default class TimedMessageBar extends React.Component<ITimedMessageBarProps, ITimedMessageBarState> {
  constructor(props) {
    super(props);

    this.state = {
      hidden: false
    };
  }

  public componentDidMount() {
    setTimeout(() => {
      this.setState({
        hidden: true
      });
    }, this.props.delay);
  }

  public render(): React.ReactElement<ITimedMessageBarProps> {
    const { text, type } = this.props;
    const { hidden } = this.state;

    return (
      !hidden ?
        <MessageBar
          messageBarType={type}>
          {text}
        </MessageBar>
        : null
    );
  }
}
