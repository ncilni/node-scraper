import { ErrorHandler, Injectable} from '@angular/core';
@Injectable()
export class ScrapperErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error) {
     // IMPORTANT: Rethrow the error dont store it :)
     throw error;
  }
  
}