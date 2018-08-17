import { sp, ItemAddResult } from '@pnp/sp';
import { IPollService } from '../Interfaces/IPollService';
import { IListDetails, IQuestionDetails, IResponseDetails } from '../Models';
import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';

export class PollService implements IPollService {

  public static readonly serviceKey: ServiceKey<IPollService> = ServiceKey.create<IPollService>("QP:PollService", PollService);

  /**
   * 
   */
  public getSurveyLists(): Promise<IListDetails[]> {
    return new Promise<IListDetails[]>((resolve: (listDetails: IListDetails[]) => void, reject: (error: any) => void): void => {
      let retListDetails: IListDetails[] = [];
      sp.web.lists.filter("BaseTemplate eq 102 && Hidden eq false").get()
        .then((lists: any[]) => {
          if (lists.length > 0) {
            lists.map((list, index) => {
              retListDetails.push({
                Id: list.Id,
                Title: list.Title
              });
            });
          }
          resolve(retListDetails);
        });
    });
  }

  /**
   * 
   * @param listId 
   */
  public getPollQuestions(listId: string): Promise<IQuestionDetails[]> {
    return new Promise<IQuestionDetails[]>((resolve: (questionDetails: IQuestionDetails[]) => void, reject: (error: any) => void): void => {
      let retQuestDetails: IQuestionDetails[] = [];
      sp.web.lists.getById(listId).fields
        .filter("FieldTypeKind eq 6 && Hidden eq false")
        .get()
        .then((fields: any[]) => {
          if (fields.length > 0) {
            fields.map((field, index) => {
              retQuestDetails.push({
                Id: field.Id,
                DisplayName: field.Title,
                InternalName: field.InternalName
              });
            });
          }
          resolve(retQuestDetails);
        });
    });
  }

  /**
   * 
   * @param listID 
   * @param questionID 
   */
  public getPollQuestionById(listID: string, questionID: string): Promise<IQuestionDetails> {
    return new Promise<IQuestionDetails>((resolve: (questionInfo: IQuestionDetails) => void, reject: (error: any) => void): void => {
      let retQuestInfo: IQuestionDetails;
      sp.web.lists.getById(listID).fields.getById(questionID).get()
        .then((questInfo: any) => {
          if (questInfo) {
            retQuestInfo = {
              Id: questInfo.Id,
              DisplayName: questInfo.Title,
              InternalName: questInfo.InternalName,
              Choices: questInfo.Choices
            }
          }
          resolve(retQuestInfo);
        });
    });
  }

  /**
   * 
   * @param listID 
   * @param questionID 
   */
  public getPollResponses(listID: string, questionInfo: IQuestionDetails): Promise<IResponseDetails[]> {
    return new Promise<IResponseDetails[]>((resolve: (questionInfo: IResponseDetails[]) => void, reject: (error: any) => void): void => {
      let retResponses: IResponseDetails[] = [];
      sp.web.lists.getById(listID).items.select(questionInfo.InternalName, "Author/Id", "Author/Title").expand("Author")
        //.filter(`${questionInfo.InternalName} eq `)
        .getAll()
        .then((responses: any) => {
          if (responses.length > 0) {
            responses.map((pollResponse: any) => {
              retResponses.push({
                UserID: pollResponse.Author.Id,
                UserName: pollResponse.Author.Title,
                PollResponse: pollResponse[questionInfo.InternalName],
                PollQuestion: questionInfo.DisplayName,
                PollQuestionIN: questionInfo.InternalName
              });
            })
          }
          resolve(retResponses);
        })
    });
  }

  public submitPollResponse(listID: string, responseInfo: IResponseDetails): Promise<boolean> {
    return new Promise<boolean>((resolve: (retResponse: boolean) => void, reject: (error: any) => void): void => {
      sp.web.lists.getById(listID).items.add({
        [responseInfo.PollQuestionIN]: responseInfo.PollResponse
      }).then((ResAdd: ItemAddResult) => {
        resolve(true);
      }, (error: any): void => {
        reject(false);
        console.log(error);
      });
    });
  }
}