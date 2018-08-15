import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { IListDropdownProps } from './IListDropdownProps';
import { IListDropdownState } from './IListDropdownState';

export default class ListDropdown extends React.Component<IListDropdownProps, IListDropdownState> {
 private selectedKey: React.ReactText;

 constructor(props: IListDropdownProps, state: IListDropdownState) {
   super(props);
   this.selectedKey = props.selectedKey;

   this.state = {
     loading: false,
     options: undefined,
     error: undefined
   };
 }

 public componentDidMount(): void {
   this.loadOptions();
 }

 public componentDidUpdate(prevProps: IListDropdownProps, prevState: IListDropdownState): void {
   if (this.props.disabled !== prevProps.disabled ||
     this.props.stateKey !== prevProps.stateKey) {
     this.loadOptions();
   }
 }

 private loadOptions(): void {
   this.setState({
     loading: true,
     error: undefined,
     options: undefined
   });

   this.props.loadOptions()
     .then((options: IDropdownOption[]): void => {
       this.setState({
         loading: false,
         error: undefined,
         options: options
       });
     }, (error: any): void => {
       this.setState((prevState: IListDropdownState, props: IListDropdownProps): IListDropdownState => {
         prevState.loading = false;
         prevState.error = error;
         return prevState;
       });
     });
 }

 public render(): JSX.Element {
   const loading: JSX.Element = this.state.loading ? <div><Spinner label={this.props.loadingText} /></div> : <div />;
   const error: JSX.Element = this.state.error !== undefined ? <div className={'ms-TextField-errorMessage ms-u-slideDownIn20'}>Error while loading items: {this.state.error}</div> : <div />;

   return (
     <div>
       <Dropdown label={this.props.label}
         disabled={this.props.disabled || this.state.loading || this.state.error !== undefined}
         onChanged={this.onChanged.bind(this)}
         selectedKey={this.selectedKey}
         options={this.state.options} />
       {loading}
       {error}
     </div>
   );
 }

 private onChanged(option: IDropdownOption, index?: number): void {
   this.selectedKey = option.key;
   // reset previously selected options
   const options: IDropdownOption[] = this.state.options;
   options.forEach((o: IDropdownOption): void => {
     if (o.key !== option.key) {
       o.selected = false;
     }
   });
   this.setState((prevState: IListDropdownState, props: IListDropdownProps): IListDropdownState => {
     prevState.options = options;
     return prevState;
   });
   if (this.props.onChanged) {
     this.props.onChanged(option, index);
   }
 }
}