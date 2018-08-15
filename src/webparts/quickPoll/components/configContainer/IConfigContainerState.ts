import {ISettings} from '../../../../Models/ISettings';
export interface IConfigContainerState {
   showPanel: boolean;
   dirty: boolean;
   isError: boolean;
   isSaved: boolean;
   isEdit: boolean;
   isOverlayShow: boolean;
   PollSettings: ISettings;
}