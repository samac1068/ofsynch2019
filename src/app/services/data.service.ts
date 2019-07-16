import { DatastoreService } from './datastore.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  wsURL: string = "https://mobcop.aoc.army.pentagon.smil.mil/MOBAPI/OFS";

  constructor(private http: HttpClient, private ds: DatastoreService) { }

  // Error Handling
  private errorHandler(error){
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    alert(errorMessage);
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // This will identify which server is being targeted.
  identifyWSServer(): string {
    return (this.ds.isLocalServer()) ? `http://localhost:3004/` : `${this.wsURL}`;
  }

  // Retrieve Data from local file
  getColumnData(): Observable<any> {
    return this.http.get<any>('./assets/dg-columns.json')
    .pipe(catchError(this.errorHandler));
  }

  // Retrieve Data from Server
  getOperationData(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + ((!this.ds.isLocalServer()) ? `/GetOperationData/${this.ds.getPassKey()}/` : "");
    return (this.http.get<any>(fullDomain + this.ds.curSelectedButton)
      .pipe(catchError(this.errorHandler)));
  }

  //Retrive the sub operation data from the server
  getSubOperationData(subop: string): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + ((!this.ds.isLocalServer()) ? `/GetOperationData/${this.ds.getPassKey()}/` : "");
    return (this.http.get<any>(fullDomain + subop)
      .pipe(catchError(this.errorHandler)));
  }
}
