import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import styles from './MessageContainer.module.scss';
import { MessageScope } from '../../../../common/enumHelper';
import IMessageContainerProps from './IMessageContainerProps';

export default class MessageContainer extends React.Component<IMessageContainerProps, {}>{
    constructor(props: IMessageContainerProps) {
        super(props);
    }
    public render(): JSX.Element {
        return (
            <div className={styles.MessageContainer}>
                {
                    this.props.MessageScope === MessageScope.Success &&
                    <MessageBar messageBarType={MessageBarType.success}>{this.props.Message}</MessageBar>
                }
                {
                    this.props.MessageScope === MessageScope.Failure &&
                    <MessageBar messageBarType={MessageBarType.error}>{this.props.Message}</MessageBar>
                }
                {
                    this.props.MessageScope === MessageScope.Warning &&
                    <MessageBar messageBarType={MessageBarType.warning}>{this.props.Message}</MessageBar>
                }
                {
                    this.props.MessageScope === MessageScope.Info &&
                    <MessageBar className={styles.infoMessage}>{this.props.Message}</MessageBar>
                }
            </div>
        );
    }
}