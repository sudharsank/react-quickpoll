declare interface IQuickPollWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListFieldLabel: string;
  // Configuration Container
  Configure_ButtonText: string;
  Configure_EditDescription: string;
  Configure_PreviewDescription: string;
  Configure_IconText: string;
}

declare module 'QuickPollWebPartStrings' {
  const strings: IQuickPollWebPartStrings;
  export = strings;
}
