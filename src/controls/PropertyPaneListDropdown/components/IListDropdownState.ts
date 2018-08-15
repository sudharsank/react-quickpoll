import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';

export interface IListDropdownState {
 loading: boolean;
 options: IDropdownOption[];
 error: string;
}