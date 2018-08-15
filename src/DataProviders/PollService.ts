import { sp } from '@pnp/sp';
import { IPollService } from '../Interfaces/IPollService';
import { IListDetails, IQuestionDetails } from '../Models';
import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';

export class PollService implements IPollService {

   public static readonly serviceKey: ServiceKey<IPollService> = ServiceKey.create<IPollService>("QP:PollService", PollService);

   public getSurveyLists(): Promise<IListDetails[]> {
      return new Promise<IListDetails[]>((resolve: (listDetails: IListDetails[]) => void, reject: (error: any) => void): void => {
         let retListDetails: IListDetails[] = [];
         sp.web.lists.filter("BaseTemplate eq 102 && Hidden eq false").get()
            .then((lists: any[]) => {
               if (lists.length > 0) {
                  //console.log("Lists: ", lists);
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
}