import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';

export interface IListDropdownProps {
 label: string;
 loadOptions: () => Promise<IDropdownOption[]>;
 onChanged: (option: IDropdownOption, index?: number) => void;
 selectedKey: string | number;
 disabled: boolean;
 stateKey: string;
 loadingText: string;
}