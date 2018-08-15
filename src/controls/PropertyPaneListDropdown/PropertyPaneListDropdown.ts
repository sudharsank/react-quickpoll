import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
 IPropertyPaneField,
 PropertyPaneFieldType
} from '@microsoft/sp-webpart-base';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { IPropertyPaneListDropdownProps } from './IPropertyPaneListDropdownProps';
import { IPropertyPaneListDropdownInternalProps } from './IPropertyPaneListDropdownInternalProps';
import ListDropdown from './components/ListDropdown';
import { IListDropdownProps } from './components/IListDropdownProps';

export class PropertyPaneAsyncDropdown implements IPropertyPaneField<IPropertyPaneListDropdownProps> {
 public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
 public targetProperty: string;
 public properties: IPropertyPaneListDropdownInternalProps;
 private elem: HTMLElement;

 constructor(targetProperty: string, properties: IPropertyPaneListDropdownProps) {
   this.targetProperty = targetProperty;
   this.properties = {
     key: properties.label,
     label: properties.label,
     loadOptions: properties.loadOptions,
     onPropertyChange: properties.onPropertyChange,
     selectedKey: properties.selectedKey,
     disabled: properties.disabled,
     onRender: this.onRender.bind(this),
     loadingText: properties.loadingText
   };
 }

 public render(): void {
   if (!this.elem) {
     return;
   }

   this.onRender(this.elem);
 }

 private onRender(elem: HTMLElement): void {
   if (!this.elem) {
     this.elem = elem;
   }

   const element: React.ReactElement<IListDropdownProps> = React.createElement(ListDropdown, {
     label: this.properties.label,
     loadOptions: this.properties.loadOptions,
     onChanged: this.onChanged.bind(this),
     selectedKey: this.properties.selectedKey,
     disabled: this.properties.disabled,
     // required to allow the component to be re-rendered by calling this.render() externally
     stateKey: new Date().toString(),
     loadingText: this.properties.loadingText
   });
   ReactDom.render(element, elem);
 }

 private onChanged(option: IDropdownOption, index?: number): void {
   this.properties.onPropertyChange(this.targetProperty, option.key);
 }
}