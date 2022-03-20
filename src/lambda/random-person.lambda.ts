import * as uuid from "uuid";
import { IError } from "../models/error.interface";
import { IPerson } from "../models/person.interface";
import * as Chance from "chance";

interface IId {
    id: number;
}

export const handler =  async (event: IId): Promise<IPerson | IError> => {
  const chance: Chance.Chance = new Chance();
  const promise = new Promise<IPerson | IError>((resolve, reject) => {
    if (event == null || event.id == null) {
      reject("An id must be supplied to perform a person search.");
    } else if (event.id <= 0) {
      reject("Ids must be greater than 0 to perform a person search.");
    } else {
      const person: IPerson = {
        _id: uuid.v4(),
        firstName: chance.first(),
        lastName: chance.last(),
        phoneNumbers: [chance.phone(), chance.phone(), chance.phone()],
      };
        resolve(person);
    }
  })
    .then((data) => {
      return data as IPerson;
    })
    .catch((error) => {
      return {
        errorMessage: error,
      } as IError;
    });
  return promise;
};