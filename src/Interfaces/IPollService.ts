import { IListDetails, IQuestionDetails, IResponseDetails } from '../Models';
export interface IPollService {
   getSurveyLists(): Promise<IListDetails[]>;
   getPollQuestions(listId: string): Promise<IQuestionDetails[]>;
   getPollQuestionById(listID: string, questionID: string): Promise<IQuestionDetails>;
   getPollResponses(listID: string, questionInfo: IQuestionDetails): Promise<IResponseDetails[]>;
}