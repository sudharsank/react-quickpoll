import * as React from 'react';
import Chart from 'chart.js';
import { IPollAnalyticsInfo } from '../../../../Models';

export interface IQuickPollChartProps {
  PollAnalytics: IPollAnalyticsInfo;
}

export default class QuickPollChart extends React.Component<IQuickPollChartProps, {}> {
  constructor(props: IQuickPollChartProps) {
    super(props);
  }

  public render(): React.ReactElement<IQuickPollChartProps> {
    let chartControl = null;
    chartControl = <canvas id="myChart" max-width="400" max-height="300"></canvas>;
    this.renderChart();
    return (
      <div>
        {chartControl}
      </div>
    );
  }

  private renderChart(): void {
    if (undefined !== this.props.PollAnalytics) {
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: this.props.PollAnalytics.ChartType,
        data: {
          labels: this.props.PollAnalytics.Labels,
          datasets: [{
            //label: '# of Votes',
            data: this.props.PollAnalytics.PollResponse,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 90, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 90, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          // scales: {
          //   yAxes: [{
          //     ticks: {
          //       beginAtZero: true
          //     }
          //   }]
          // }
        }
      });
    }
  }

  componentDidMount(): void {
    if (this.props.PollAnalytics != null && undefined !== this.props.PollAnalytics) {
      this.renderChart();
    }
  }

  public componentWillReceiveProps(nextProps: IQuickPollChartProps): void {
    if (this.props.PollAnalytics !== nextProps.PollAnalytics) {
      this.render();
    }
  }

  // protected componentShouldUpdate = (newProps: IQuickPollChartProps) => {
  //   return (
  //     this.props.PollAnalytics !== newProps.PollAnalytics
  //   );
  // }
}