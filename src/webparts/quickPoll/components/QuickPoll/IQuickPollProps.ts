import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { ServiceScope, DisplayMode } from '@microsoft/sp-core-library';
export interface IQuickPollProps {  
  /**
   * Web part display mode. Used for inline editing of the web part title
   */
  displayMode: DisplayMode;
  /**
   * Current context for Configure button
   */
  currentContext: IWebPartContext;
  /**
   * Selected list ID
   */
  listID: string;
  /**
   * Selection Question
   */
  question: string;
  /**
   * Service scope
   */
  serviceScope: ServiceScope;
}
