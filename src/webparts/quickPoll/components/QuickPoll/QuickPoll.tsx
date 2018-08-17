import * as React from 'react';
import styles from '../QuickPoll.module.scss';
import {
  DisplayMode,
  ServiceScope,
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { DefaultButton, PrimaryButton, ButtonType, IButtonProps, Button } from 'office-ui-fabric-react/lib/Button';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'QuickPollWebPartStrings';
import Chart from 'chart.js';
import _ from 'underscore';
import { IQuickPollProps } from './IQuickPollProps';
import { IQuickPollState } from './IQuickPollState';
import { IPollService } from '../../../../Interfaces/IPollService';
import { PollService } from '../../../../DataProviders/PollService';
import ConfigContainer from '../configContainer/ConfigContainer';
import { IQuestionDetails, IResponseDetails, IPollAnalyticsInfo } from '../../../../Models';
/* Components */
import QuickPollChart from '../chartContainer/QuickPollChart';
import MessageContainer from '../MessageContainer/MessageContainer';
import { MessageScope } from '../../../../common/enumHelper';



export default class QuickPoll extends React.Component<IQuickPollProps, IQuickPollState> {

  private pollservice: IPollService;
  private pollQuestionToDisplay: IQuestionDetails;
  private listid: string;
  private questionid: string;

  constructor(props: IQuickPollProps, state: IQuickPollState) {
    super(props);
    this.state = {
      PollQuestions: [],
      UserResponse: [],
      enableSubmit: true,
      enableChoices: true,
      showOptions: false,
      showProgress: false,
      showChart: false,
      showChartProgress: false,
      PollAnalytics: undefined,
      showMessage: false,
      isError: false,
      MsgContent: "",
      showSubmissionProgress: false
    }

    let _serviceScope: ServiceScope;
    _serviceScope = this.props.serviceScope;

    _serviceScope.whenFinished((): void => {
      this.pollservice = _serviceScope.consume(PollService.serviceKey as any) as IPollService;
    });
  }
  public render(): React.ReactElement<IQuickPollProps> {
    const { displayMode, listID, question, chartType } = this.props;
    const { showOptions, showChart, showProgress, showChartProgress, PollAnalytics, showMessage, isError, MsgContent, showSubmissionProgress } = this.state;
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
        {showProgress &&
          <ProgressIndicator label="Loading the Poll data" description="Please wait..." />
        }
        {listID && question && chartType && showOptions &&
          this.state.PollQuestions.length > 0 &&
          <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                <div className="ms-textAlignCenter ms-font-m-plus ms-fontWeight-semibold">
                  {this.state.PollQuestions[0].DisplayName}
                </div>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                <div className="ms-textAlignLeft ms-font-m-plus ms-fontWeight-semibold">
                  <ChoiceGroup disabled={!this.state.enableChoices} selectedKey={this._getSelectedKey()} options={this.onRenderChoiceOptions()} required={true} label="Pick one" onChange={this._onChange} />
                </div>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                <div className="ms-textAlignCenter ms-font-m-plus ms-fontWeight-semibold">
                  <PrimaryButton disabled={!this.state.enableSubmit} text="Submit Vote"
                    onClick={this._submitVote.bind(this)} />
                </div>
              </div>
            </div>
            {showSubmissionProgress && !showChartProgress &&
              <ProgressIndicator label="Submission is in progress" description="Please wait..." />
            }
            {showMessage && MsgContent &&
              <MessageContainer MessageScope={(isError) ? MessageScope.Failure : MessageScope.Success} Message={MsgContent} />
            }
          </div>
        }
        {/* <canvas id="myChart" max-width="400" max-height="300"></canvas> */}
        {showChartProgress && !showChart &&
          <ProgressIndicator label="Loading the Poll analytics" description="Getting all the responses..." />
        }
        {showChart &&
          <QuickPollChart PollAnalytics={PollAnalytics} />
        }
      </div>
    );
  }

  private onRenderChoiceOptions(): IChoiceGroupOption[] {
    let choices: IChoiceGroupOption[] = [];
    if (this.state.PollQuestions.length > 0) {
      if (this.state.PollQuestions[0].Choices.length > 0) {
        this.state.PollQuestions[0].Choices.map((choice: any) => {
          choices.push({
            key: choice,
            text: choice
          });
        });
      } else {
        choices.push({
          key: '0',
          text: "Sorry, no choices found",
          disabled: true,
        });
      }
    }
    return choices;
  }

  private _onChange = (ev: React.FormEvent<HTMLInputElement>, option: any): void => {
    let prevUserResponse = this.state.UserResponse;
    let userresponse: IResponseDetails;
    userresponse = {
      PollQuestion: this.state.PollQuestions[0].DisplayName,
      PollQuestionIN: this.state.PollQuestions[0].InternalName,
      PollResponse: option.key,
      UserID: this.props.currentContext.pageContext.user.loginName,
      UserName: this.props.currentContext.pageContext.user.displayName
    }
    if (prevUserResponse.length > 0) {
      let filRes = this.getUserResponse(prevUserResponse);
      //prevUserResponse.filter((response) => { return response.UserID == this.props.currentContext.pageContext.user.loginName });
      if (filRes.length > 0) {
        filRes[0].PollResponse = option.key;
      } else {
        prevUserResponse.push(userresponse);
      }
    } else {
      prevUserResponse.push(userresponse);
    }
    this.setState({
      ...this.state,
      UserResponse: prevUserResponse
    });
  }

  private _getSelectedKey(): string {
    let selKey: string = "";
    if (this.state.UserResponse.length > 0) {
      var userResponses = this.state.UserResponse;
      var userRes = this.getUserResponse(userResponses);
      if (userRes.length > 0) {
        selKey = userRes[0].PollResponse
      }
    }
    return selKey;
  }

  private _submitVote(): void {
    this.setState({
      ...this.state,
      enableSubmit: false,
      enableChoices: false,
      showSubmissionProgress: true
    });
    var curUserRes = this.getUserResponse(this.state.UserResponse);
    this.pollservice.submitPollResponse(this.props.listID, curUserRes[0])
      .then((res: any) => {
        if (res) {
          this.setState({
            ...this.state,
            showSubmissionProgress: false,
            showMessage: true,
            isError: false,
            MsgContent: strings.SuccessfullVoteSubmission,
            showChartProgress: true
          });
          setTimeout(() => {
            this.getAllUsersResponses(this.state.PollQuestions[0]);
          }, 2000);
        }
      }, (error: any) => {
        this.setState({
          ...this.state,
          enableSubmit: true,
          enableChoices: true,
          showSubmissionProgress: false,
          showMessage: true,
          isError: true,
          MsgContent: strings.FailedVoteSubmission
        });
      });
  }

  private checkAndBindResponseAnalytics = () => {
    if (this.state.UserResponse.length > 0) {
      var curUserRes = this.state.UserResponse.filter((cuRes) => {
        return cuRes.UserName == this.props.currentContext.pageContext.user.displayName &&
          (cuRes.PollResponse !== null && cuRes.PollResponse != "" && undefined !== cuRes.PollResponse)
      });
      //console.log(curUserRes);
      if (curUserRes.length > 0) {
        this.setState({
          showChartProgress: true,
          showChart: true
        });
        var tempData = _.countBy(this.state.UserResponse, 'PollResponse');
        //console.log("Temp data: ", tempData);
        var data = [];
        this.state.PollQuestions[0].Choices.map(function (label) {
          if (tempData[label] == undefined) {
            data.push(0);
          } else data.push(tempData[label]);
        });
        var pollAnalytics: IPollAnalyticsInfo;
        pollAnalytics = {
          ChartType: this.props.chartType,
          Labels: this.state.PollQuestions[0].Choices,
          Question: this.state.PollQuestions[0].DisplayName,
          PollResponse: data
        };
        this.setState({
          showProgress: false,
          showOptions: false,
          showChartProgress: false,
          showChart: true,
          PollAnalytics: pollAnalytics
        });
      } else {
        this.setState({
          showProgress: false,
          showOptions: true
        });
      }
    }
  }

  private getAllUsersResponses = (questInfo: IQuestionDetails) => {
    this.pollservice.getPollResponses(this.listid, questInfo)
      .then((responses: IResponseDetails[]) => {
        //console.log("All Responses: ", responses);
        this.setState({
          ...this.state,
          UserResponse: responses
        });
        this.checkAndBindResponseAnalytics();
      });
  }

  private bindPolls = (listID?: string, QuestionID?: string) => {
    if (listID) {
      this.listid = listID;
    } else {
      this.listid = this.props.listID;
    }
    if (QuestionID) {
      this.questionid = QuestionID;
    } else {
      this.questionid = this.props.question;
    }
    this.setState({
      showProgress: true,
      enableSubmit: true,
      enableChoices: true,
      showOptions: false,
      showChart: false,
      showChartProgress: false,
      PollAnalytics: undefined,
      showMessage: false,
      isError: false,
      MsgContent: "",
      showSubmissionProgress: false
    });
    this.pollservice.getPollQuestionById(this.listid, this.questionid)
      .then((questInfo: IQuestionDetails) => {
        let pollQuestions: IQuestionDetails[] = [];
        //console.log('Question Info: ', questInfo);
        pollQuestions.push(questInfo);
        this.setState({
          PollQuestions: pollQuestions
        });
        this.getAllUsersResponses(questInfo);
      });
  }

  public componentDidMount(): void {
    this.bindPolls();
  }

  // public shouldComponentUpdate(newProps: IQuickPollProps): boolean {
  //   console.log("shouldComponentUpdate");
  //   return (
  //     // this.props.listID !== newProps.listID ||
  //     // this.props.question !== newProps.question ||
  //     // this.props.chartType !== newProps.chartType
  //     false
  //   );
  // }

  public componentWillReceiveProps(newProps: IQuickPollProps): void {
    if (this.props.listID != newProps.listID || this.props.question != newProps.question) {
      this.bindPolls(newProps.listID, newProps.question);
    } else if (this.props.chartType != newProps.chartType) {
      let newPollAnalytics: IPollAnalyticsInfo = this.state.PollAnalytics;
      newPollAnalytics.ChartType = newProps.chartType;
      this.setState({
        PollAnalytics: newPollAnalytics
      });
    }

  }

  private getUserResponse(UserResponses: IResponseDetails[]): IResponseDetails[] {
    let retUserResponse: IResponseDetails[];
    retUserResponse = UserResponses.filter((res) => { return res.UserName == this.props.currentContext.pageContext.user.displayName });
    return retUserResponse;
  }
}
