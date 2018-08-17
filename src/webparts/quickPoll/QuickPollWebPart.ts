import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, ServiceScope } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import { PropertyFieldChoiceGroupWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldChoiceGroupWithCallout';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { update, get } from '@microsoft/sp-lodash-subset';
/** SP PnP Reference */
import { sp } from '@pnp/sp';
import * as strings from 'QuickPollWebPartStrings';
import QuickPoll from './components/QuickPoll/QuickPoll';
import { IQuickPollProps } from './components/QuickPoll/IQuickPollProps';
import { PropertyPaneAsyncDropdown } from '../../controls/PropertyPaneListDropdown/PropertyPaneListDropdown';
import { IPollService } from '../../Interfaces/IPollService';
import { PollService } from '../../DataProviders/PollService';
import { IListDetails } from '../../Models';
import { IQuestionDetails } from '../../../lib/Models';

export interface IQuickPollWebPartProps {
  listID: string;
  question: string;
  chartType: string;
  serviceScope: ServiceScope;
}

export default class QuickPollWebPart extends BaseClientSideWebPart<IQuickPollWebPartProps> {

  private questionsDropdownDisable: boolean = true;
  private questionsList: IDropdownOption[] = [];
  private questionsDropDown: PropertyPaneAsyncDropdown;
  private pollservice: IPollService;

  protected onInit(): Promise<void> {
    let _serviceScope: ServiceScope;
    _serviceScope = this.context.serviceScope;

    _serviceScope.whenFinished((): void => {
      this.pollservice = _serviceScope.consume(PollService.serviceKey as any) as IPollService;
    });
    sp.setup({
      spfxContext: this.context
    });
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IQuickPollProps> = React.createElement(
      QuickPoll,
      {
        ...this.properties,
        domElement: this.context.domElement,
        currentContext: this.context,
        displayMode: this.displayMode,
        serviceScope: this.context.serviceScope
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get disableReactivePropertyChanges(): boolean {
    return false;
  }

  private loadLists(): Promise<IDropdownOption[]> {
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      this.pollservice.getSurveyLists()
        .then((lists: IListDetails[]) => {
          let listsOptions: IDropdownOption[] = [];
          if (lists.length > 0) {
            lists.map((list, index) => {
              listsOptions.push({
                key: list.Id,
                text: list.Title
              });
            });
          }
          resolve(listsOptions);
        });
    });
  }

  private loadQuestions(): Promise<IDropdownOption[]> {
    //const wp: QuickPollWebPart = this;
    let questionsOptions: IDropdownOption[] = [];
    if (!this.properties.listID || this.properties.listID == "0") {
      return Promise.resolve();
    }
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      this.pollservice.getPollQuestions(this.properties.listID)
        .then((questions: IQuestionDetails[]) => {
          questions.map((quest, index) => {
            questionsOptions.push({
              key: quest.Id,
              text: quest.DisplayName
            });
          });
          resolve(questionsOptions);
        });
    });
  }

  private onListChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // reset selected question
    this.properties.question = undefined;
    // store new value in web part properties
    update(this.properties, 'question', (): any => { return this.properties.question; });
    // refresh web part
    this.render();
    // reset selected values in item dropdown
    this.questionsDropDown.properties.selectedKey = this.properties.question;
    // allow to load items
    this.questionsDropdownDisable = false;
    this.questionsDropDown.properties.disabled = false;
    // load items and re-render items dropdown
    this.questionsDropDown.render();
  }

  private onQuestionChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // refresh web part
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // reference to item dropdown needed later after selecting a list
    this.questionsDropDown = new PropertyPaneAsyncDropdown('question', {
      label: strings.QuestFieldLabel,
      loadOptions: this.loadQuestions.bind(this),
      onPropertyChange: this.onQuestionChange.bind(this),
      selectedKey: this.properties.question,
      // should be disabled if no list has been selected
      disabled: !this.properties.listID,
      loadingText: strings.QuestFieldLoadingText
    });
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                new PropertyPaneAsyncDropdown('listID', {
                  label: strings.ListFieldLabel,
                  loadOptions: this.loadLists.bind(this),
                  onPropertyChange: this.onListChange.bind(this),
                  selectedKey: this.properties.listID,
                  loadingText: strings.ListFieldLoadingText
                }),
                this.questionsDropDown,
                PropertyFieldChoiceGroupWithCallout('chartType', {
                  calloutContent: React.createElement('div', {}, strings.ChartFieldCalloutText),
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'choice_charttype',
                  label: strings.ChartFieldLabel,
                  options: [
                  // {
                  //   key: 'bar',
                  //   text: 'Bar',
                  //   checked: this.properties.chartType === 'bar',
                  //   //iconProps: { officeFabricIconFontName: 'Add' }
                  // }, 
                  {
                    key: 'pie',
                    text: 'Pie',
                    checked: this.properties.chartType === 'pie',
                    //iconProps: { officeFabricIconFontName: 'PieSingle' }
                  }, {
                    key: 'doughnut',
                    text: 'Doughnut',
                    checked: this.properties.chartType === 'doughnut',
                    //iconProps: { officeFabricIconFontName: 'DonutChart' }
                  }]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
