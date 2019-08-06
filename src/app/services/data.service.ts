import { DatastoreService } from './datastore.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Damps } from '../models/damps';

const httpHeaders = {
  headers: new HttpHeaders ({
    'Content-Type': 'application/json'
  })
};

const httpOpt = {
  headers: httpHeaders
}; 

@Injectable({
  providedIn: 'root'
})
export class DataService {

  wsURL: string = "https://mobcop.aoc.army.pentagon.smil.mil/MOBAPI/OFS";
  wsLocal: string = "http://localhost:62441/api/Values";
  
  constructor(private http: HttpClient, private ds: DatastoreService) { }

  // Error Handling
  private errorHandler(error: any){
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      console.log(error);
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      console.log(error);
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    alert(errorMessage);
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // This will identify which server is being targeted.
  identifyWSServer(): string {
    return (this.ds.useLocalServer) ? this.wsLocal : this.wsURL;
  }

  // Retrieve Data from local file
  getColumnData(): Observable<any> {
    return this.http.get<any>('./assets/dg-columns.json')
    .pipe(catchError(this.errorHandler));
  }

  // Retrieve Data from Server
  getOperationData(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/GetOperationData`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('op', this.ds.curSelectedButton);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  //Retrive the sub operation data from the server
  getSubOperationData(subop: string): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/GetOperationData`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('op', subop);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  modifyFPOperationRecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateFPOperationData`;
    return (this.http.post<Damps>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }
}
