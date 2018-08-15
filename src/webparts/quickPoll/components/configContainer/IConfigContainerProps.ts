import { IWebPartContext } from '@microsoft/sp-webpart-base';
import {ISettings} from '../../../../Models/ISettings';
export interface IConfigContainerProps {
  currentContext: IWebPartContext;
  iconText?: string;
  description?: string;
  buttonText?: string;
  displayButton?: boolean;
}
