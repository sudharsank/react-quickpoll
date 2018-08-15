import {ISettings} from '../../../../Models/ISettings';
export interface ISettingsContainerProps {
   isOverlayShow: boolean;
   showPanel: boolean;
   onCloseManageScreen: () => void;
   onRenderFooterContent: () => JSX.Element;
   onHandleListNameTextField: (newValue: string) => void;
   isError: boolean;
   isSaved: boolean;
   PollSettings: ISettings;
}