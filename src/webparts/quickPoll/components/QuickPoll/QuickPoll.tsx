import * as React from 'react';
import styles from '../QuickPoll.module.scss';
import {
  DisplayMode,
  ServiceScope,
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'QuickPollWebPartStrings';
import Chart from 'chart.js';
import { IQuickPollProps } from './IQuickPollProps';
import { IQuickPollState } from './IQuickPollState';
import { IPollService } from '../../../../Interfaces/IPollService';
import { PollService } from '../../../../DataProviders/PollService';
import ConfigContainer from '../configContainer/ConfigContainer';
import { IQuestionDetails, IResponseDetails } from '../../../../Models';


export default class QuickPoll extends React.Component<IQuickPollProps, IQuickPollState> {

  private pollservice: IPollService;

  constructor(props: IQuickPollProps, state: IQuickPollState) {
    super(props);
    this.state = {
      showPollContainer: false
    }

    let _serviceScope: ServiceScope;
    _serviceScope = this.props.serviceScope;

    _serviceScope.whenFinished((): void => {
      this.pollservice = _serviceScope.consume(PollService.serviceKey as any) as IPollService;
    });
  }
  public render(): React.ReactElement<IQuickPollProps> {
    const { displayMode, listID, question, chartType } = this.props;
    return (
      <div className={styles.quickPoll}>
        {displayMode === DisplayMode.Edit && (!listID || !question || !chartType) &&
          <ConfigContainer
            buttonText={strings.Configure_ButtonText}
            currentContext={this.props.currentContext}
            description={strings.Configure_EditDescription}
            iconText={strings.Configure_IconText}
            displayButton={true} />
        }
        {(!listID || !question || !chartType) && displayMode === DisplayMode.Read &&
          <ConfigContainer
            buttonText={strings.Configure_ButtonText}
            currentContext={this.props.currentContext}
            description={strings.Configure_PreviewDescription}
            iconText={strings.Configure_IconText}
            displayButton={false} />
        }
        {/* <canvas id="myChart" max-width="400" max-height="300"></canvas> */}
        {listID && question && chartType &&
          <div>
            <div>ListName: {listID}</div>
            <div>Question: {question}</div>
            <div>Chart Type: {chartType}</div>
          </div>
        }
      </div>
    );
  }

  public componentDidMount(): void {

    this.pollservice.getPollQuestionById(this.props.listID, this.props.question)
      .then((questInfo: IQuestionDetails) => {
        console.log('Question Info: ', questInfo);
        this.pollservice.getPollResponses(this.props.listID, questInfo)
          .then((responses: IResponseDetails[]) => {
            console.log('Responses: ', responses);
          });
      })

    // var ctx = "myChart";
    // var myChart = new Chart(ctx, {
    //   type: 'bar',
    //   data: {
    //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5, 2, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255,99,132,1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }]
    //     }
    //   }
    // });
  }

}
