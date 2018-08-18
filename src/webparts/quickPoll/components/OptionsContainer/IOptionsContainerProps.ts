import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
export interface IOptionsContainerProps {
  disabled: boolean;
  selectedKey: () => string;
  options: string[];
  label?: string;
  onChange: (ev: React.FormEvent<HTMLInputElement>, option: any) => void;
  FieldTypeKind: number;
}