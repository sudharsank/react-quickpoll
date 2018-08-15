import * as React from 'react';
import styles from '../QuickPoll.module.scss';
import {
  DisplayMode,
  ServiceScope,
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as strings from 'QuickPollWebPartStrings';
import Chart from 'chart.js';
import { IQuickPollProps } from './IQuickPollProps';
import { IQuickPollState } from './IQuickPollState';
import { IPollService } from '../../../../Interfaces/IPollService';
import { PollService } from '../../../../DataProviders/PollService';
import ConfigContainer from '../configContainer/ConfigContainer';


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
    const { displayMode, listName, question } = this.props;    
    return (
      <div className={styles.quickPoll}>
        {displayMode === DisplayMode.Edit && (!listName || !question) && 
          <ConfigContainer
            buttonText={strings.Configure_ButtonText}
            currentContext={this.props.currentContext}
            description={strings.Configure_EditDescription}
            iconText={strings.Configure_IconText}
            displayButton={true} />
        }
        {(!listName || !question) && displayMode === DisplayMode.Read &&
          <ConfigContainer
            buttonText={strings.Configure_ButtonText}
            currentContext={this.props.currentContext}
            description={strings.Configure_PreviewDescription}
            iconText={strings.Configure_IconText}
            displayButton={false} />
        }
        {/* <canvas id="myChart" max-width="400" max-height="300"></canvas> */}
        {listName && question &&
          <div>
            ListName: {this.props.listName}
            Question: {this.props.question}
          </div>
        }
      </div>
    );
  }

  public componentDidMount(): void {
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
