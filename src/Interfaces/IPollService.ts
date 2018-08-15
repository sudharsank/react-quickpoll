import { IListDetails, IQuestionDetails } from '../Models';
export interface IPollService {
   getSurveyLists(): Promise<IListDetails[]>;
   getPollQuestions(listId: string): Promise<IQuestionDetails[]>;
}