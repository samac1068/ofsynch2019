import { MissionAssign } from './../models/missionassign';
import { Fundcites } from './../models/fundcites';
import { DatastoreService } from './datastore.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { Damps } from '../models/damps';
import { Cycle } from '../models/cycle';
import { Tpfdd } from './../models/tpfdd';
import { Conusa } from './../models/conusa';
import { TCS } from './../models/tcs';
import { Pay } from './../models/pay';
import { Orders } from '../models/orders';
import { Operation } from '../models/operations';

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
  
  constructor(private http: HttpClient, private ds: DatastoreService) { }

  ngOnInit(): void {
    
  }

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
    return this.ds.getWSAPI();
  }

  identifyAPIServerLocation(results: any): void {
    for(var i = 0; i < results.length; i++)
    {
      if(results[i].active) {
        this.ds.setWSAPI(results[i].url, results[i].location);
        break;
      }
    }

    //console.log("API Server URL is: ", this.identifyWSServer());
  }

  // Retrieve Data from local file
  setWSServer(): Observable<any>  {
    return this.http.get('assets/config/config.txt')
    .pipe(catchError(this.errorHandler));
  }

  getColumnData(): Observable<any> {
    return this.http.get('assets/config/dg-columns.txt')
    .pipe(catchError(this.errorHandler));
  }

  // Establish Secure Connection and Store Retrieved Token
  getSessionToken(): Observable<any> {
    var fullDomain: string = this.identifyWSServer().split("/api")[0] + `/token`;
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new  HttpParams().set('grant_type', 'password')
                                    .set('username', this.ds.getPassKey());
                                    
    localStorage.setItem("token", this.ds.getPassKey());  // Forcing a key that can be used for authorization with the API

    return (this.http.post<any>(fullDomain, null, { params: params , headers: header })
      .pipe(catchError(this.errorHandler)));
  }

  // Retrieve Data from Server
  getOperationData(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/GetOperationData`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('op', this.ds.curSelectedButton);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  getSubOperationData(subop: string): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/GetOperationData`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('op', subop);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  searchMissionLocation(locName: string): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/SearchMissionLocation`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('locName', locName);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  getPayLOA(opID: string): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/GetPayLinesOfAccounting`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('opID', opID);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  getTCSLOA(opID: string): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/GetTCSLinesOfAccounting`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('opID', opID);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  getAllLOA(type: string): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/GetAllLinesOfAccounting`;
    const  params = new  HttpParams().set('id', this.ds.getPassKey()).set('type', type);
    return (this.http.get<any>(fullDomain, { params })
      .pipe(catchError(this.errorHandler)));
  }

  
  /////////////////////// POSTS 
  modifyFPOperationRecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateFPOperationData`;
    return (this.http.post<Damps>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }

  modifyOrdersRecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateOrdersData`;
    return (this.http.post<Orders>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler))); 
  }
  
  updatePayRecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdatePayData`;
    return (this.http.post<Pay>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }

  updateTCSRecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateTCSData`;
    return (this.http.post<TCS>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }

  updateCONUSARecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateCONUSAData`;
    return (this.http.post<Conusa>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }

  updateLocationData(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateLocationData`;
    return (this.http.post<Location>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler))); 
  }

  updateFundCiteData(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateFundCiteData`;
    return (this.http.post<Fundcites>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler))); 
  }

  updateOperationData(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateOpsLookupData`;
    return (this.http.post<Operation>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler))); 
  }

  updateTPFDDRecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateTPFDDData`;
    return (this.http.post<Tpfdd>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }

  updateCycleRecord(): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateCycleData`;
    return (this.http.post<Cycle>(fullDomain + "?id=" + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }

  modifyOpsLocationData(locationData: MissionAssign): Observable<any> {
    var fullDomain: string = this.identifyWSServer() + `/UpdateOpsLocationData`;
    return (this.http.post<MissionAssign>(fullDomain + "?id=" + this.ds.getPassKey(), locationData, httpHeaders )
    .pipe(catchError(this.errorHandler)));
  }
}
