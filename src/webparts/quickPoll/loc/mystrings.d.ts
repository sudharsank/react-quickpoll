declare interface IQuickPollWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;  
  // Configuration Container
  Configure_ButtonText: string;
  Configure_EditDescription: string;
  Configure_PreviewDescription: string;
  Configure_IconText: string;
  // Property Pane Controls
  ListFieldLabel: string;
  ListFieldLoadingText: string;
  QuestFieldLabel: string;
  QuestFieldLoadingText: string;
  ChartFieldLabel: string;
  ChartFieldCalloutText: string;
}

declare module 'QuickPollWebPartStrings' {
  const strings: IQuickPollWebPartStrings;
  export = strings;
}
