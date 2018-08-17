import { IQuestionDetails, IResponseDetails, IPollAnalyticsInfo } from "../../../../Models";

export interface IQuickPollState {
  PollQuestions: IQuestionDetails[];   
  UserResponse: IResponseDetails[];
  enableSubmit: boolean;
  enableChoices: boolean;
  showOptions: boolean;
  showProgress: boolean;
  showChart: boolean;
  showChartProgress: boolean; 
  showMessage: boolean;
  isError: boolean;
  MsgContent: string;
  PollAnalytics: IPollAnalyticsInfo;
  showSubmissionProgress: boolean;
}