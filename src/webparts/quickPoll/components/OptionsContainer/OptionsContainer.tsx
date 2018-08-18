import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IOptionsContainerProps } from './IOptionsContainerProps';

export default class OptionsContainer extends React.Component<IOptionsContainerProps, {}> {
  constructor(props: IOptionsContainerProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { disabled, selectedKey, label, options, onChange } = this.props;
    return (
      <div>
        {this.props.FieldTypeKind === 6 &&
          <ChoiceGroup disabled={disabled}
            selectedKey={this._getSelectedKey()}
            options={this.onRenderChoiceOptions()} required={true} label="Pick one"
            onChange={this._onChange} />
        }
      </div>
    )
  }

  private onRenderChoiceOptions(): IChoiceGroupOption[] {
    let choices: IChoiceGroupOption[] = [];
      if (this.props.options.length > 0) {
        this.props.options.map((choice: any) => {
          choices.push({
            key: choice,
            text: choice
          });
        });
      } else {
        choices.push({
          key: '0',
          text: "Sorry, no choices found",
          disabled: true,
        });
      }
    return choices;
  }

  private _getSelectedKey = (): string => {
    return this.props.selectedKey();
  }

  private _onChange = (ev: React.FormEvent<HTMLInputElement>, option: any): void => {
    this.props.onChange(ev, option);
  }

  // public shouldComponentUpdate(newProps: IOptionsContainerProps): boolean {
  //   console.log("shouldComponentUpdate");
  //   return (
  //     // this.props.listID !== newProps.listID ||
  //     // this.props.question !== newProps.question ||
  //     // this.props.chartType !== newProps.chartType
  //     true
  //   );
  // }

  // public componentWillMount() {
  //   this.render();
  // }
}