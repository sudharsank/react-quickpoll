import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { IConfigContainerProps } from './IConfigContainerProps';
import { IConfigContainerState } from './IConfigContainerState';

export default class ConfigContainer extends React.Component<IConfigContainerProps, {}> {
  constructor(props: IConfigContainerProps) {
    super(props);
  }
  public render(): React.ReactElement<IConfigContainerProps> {
    return (
      <div>
        {this.props.displayButton &&
          <Placeholder
            iconName='Edit'
            iconText={this.props.iconText}
            description={this.props.description}
            buttonLabel={this.props.buttonText}
            onConfigure={this.onConfigure} />
        }
        {!this.props.displayButton &&
          <Placeholder
            iconName='Edit'
            iconText={this.props.iconText}
            description={this.props.description} />
        }
      </div>
    );
  }

  private onConfigure = () => {
    this.props.currentContext.propertyPane.open();
  }
}
