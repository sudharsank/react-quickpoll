import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { ISettingsContainerProps } from './ISettingsContainerProps';

export default class SettingsContainer extends React.Component<ISettingsContainerProps, {}> {
   constructor(props: ISettingsContainerProps) {
      super(props);
   }

   public render(): JSX.Element {

      return (
         <Panel
            isOpen={this.props.showPanel}
            type={PanelType.medium}
            closeButtonAriaLabel='Close'
            onDismiss={this.props.onCloseManageScreen}
            onRenderFooterContent={this.props.onRenderFooterContent}
            headerText='Quick Poll Settings'>
            <div>
               <TextField
                  label='List Name'
                  name="ListName"
                  placeholder="Please select List Name"
                  multiline
                  autoAdjustHeight
                  required={true}
                  onChanged={this.props.onHandleListNameTextField}
                  value={this.props.PollSettings.ListName}
                  // onGetErrorMessage={this.props.onHandleURLErrorMessage}
               />
            </div>
            {this.props.isOverlayShow &&
               < div style={{ width: '100%', height: '100%' }}>
                  <Overlay
                     isDarkThemed={false}>
                     <div style={{ margin: '0 auto', top: '40%', position: 'relative' }}>
                        <Spinner size={SpinnerSize.large} label='' />
                     </div>
                  </Overlay>
               </div>
            }
         </Panel>
      )
   }

   protected componentShouldUpdate = (newProps: ISettingsContainerProps) => {
      return (
         this.props.PollSettings !== newProps.PollSettings
      );
   }
}