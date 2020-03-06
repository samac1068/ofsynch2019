import {MissionAssign} from '../models/missionassign';
import {Fundcites} from '../models/fundcites';
import {DatastoreService} from './datastore.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {Damps} from '../models/damps';
import {Cycle} from '../models/cycle';
import {Tpfdd} from '../models/tpfdd';
import {Conusa} from '../models/conusa';
import {TCS} from '../models/tcs';
import {Pay} from '../models/pay';
import {Orders} from '../models/orders';
import {Operation} from '../models/operations';
import {LocationSearch} from '../models/LocationSearch';

const httpHeaders = {
    headers: new HttpHeaders({
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

    ngOnInit(): void { }

    // Error Handling
    private static errorHandler(error: any) {
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
        for (let i = 0; i < results.length; i++) {
            if (results[i].active) {
                this.ds.setWSAPI(results[i].url, results[i].location);
                break;
            }
        }

        console.log('API Server URL is: ', this.identifyWSServer());
    }

    // Retrieve Data from local file
    setWSServer(): Observable<any> {
        return this.http.get('assets/config/config.txt')
            .pipe(catchError(DataService.errorHandler));
    }

    getColumnData(): any {
        return this.ds.dgColumnData;
    }

    // Establish Secure Connection and Store Retrieved Token
    getSessionToken(): Observable<any> {
        let fullDomain: string = this.identifyWSServer().split('/api')[0] + `/token`;
        console.log("Get session token: " + fullDomain);
        const params = "userName=sean.mcgill" + "&password=" + this.ds.getPassKey() + "&grant_type=password";

        return (this.http.post<any>(fullDomain, params)
            .pipe(catchError(DataService.errorHandler)));
    }

    // Retrieve Data from Server
    getOperationData(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/GetOperationData`;
        const params = new HttpParams().set('id', this.ds.getPassKey()).set('op', this.ds.curSelectedButton);
        return (this.http.get<any>(fullDomain, {params})
            .pipe(catchError(DataService.errorHandler)));
    }

    getSubOperationData(subop: string): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/GetOperationData`;
        const params = new HttpParams().set('id', this.ds.getPassKey()).set('op', subop);
        return (this.http.get<any>(fullDomain, {params})
            .pipe(catchError(DataService.errorHandler)));
    }

    searchMissionLocation(locName: string): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/SearchMissionLocation`;
        const params = new HttpParams().set('id', this.ds.getPassKey()).set('locName', locName);
        return (this.http.get<any>(fullDomain, {params})
            .pipe(catchError(DataService.errorHandler)));
    }

    searchGeoLocation(locName: string): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/SearchGeoLocation`;
        const params = new HttpParams().set('id', this.ds.getPassKey()).set('locName', locName);
        return (this.http.get<any>(fullDomain, {params})
            .pipe(catchError(DataService.errorHandler)));
    }

    getPayLOA(opID: string): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/GetPayLinesOfAccounting`;
        const params = new HttpParams().set('id', this.ds.getPassKey()).set('opID', opID);
        return (this.http.get<any>(fullDomain, {params})
            .pipe(catchError(DataService.errorHandler)));
    }

    getTCSLOA(opID: string): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/GetTCSLinesOfAccounting`;
        const params = new HttpParams().set('id', this.ds.getPassKey()).set('opID', opID);
        return (this.http.get<any>(fullDomain, {params})
            .pipe(catchError(DataService.errorHandler)));
    }

    getAllLOA(type: string): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/GetAllLinesOfAccounting`;
        const params = new HttpParams().set('id', this.ds.getPassKey()).set('type', type);
        return (this.http.get<any>(fullDomain, {params})
            .pipe(catchError(DataService.errorHandler)));
    }


    /////////////////////// POSTS
    modifyFPOperationRecord(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateFPOperationData`;
        return (this.http.post<Damps>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    modifyOrdersRecord(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateOrdersData`;
        return (this.http.post<Orders>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updatePayRecord(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdatePayData`;
        return (this.http.post<Pay>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updateTCSRecord(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateTCSData`;
        return (this.http.post<TCS>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updateCONUSARecord(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateCONUSAData`;
        return (this.http.post<Conusa>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updateLocationData(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateLocationData`;
        return (this.http.post<Location>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    saveMissionLocation(LocationInfo: LocationSearch): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/SaveMissionLocation`;
        return (this.http.post<Location>(fullDomain + '?id=' + this.ds.getPassKey(), LocationInfo, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updateFundCiteData(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateFundCiteData`;
        return (this.http.post<Fundcites>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updateOperationData(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateOpsLookupData`;
        return (this.http.post<Operation>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updateTPFDDRecord(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateTPFDDData`;
        return (this.http.post<Tpfdd>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    updateCycleRecord(): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateCycleData`;
        return (this.http.post<Cycle>(fullDomain + '?id=' + this.ds.getPassKey(), this.ds.curSelectedRecord, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }

    modifyOpsLocationData(locationData: MissionAssign): Observable<any> {
        let fullDomain: string = this.identifyWSServer() + `/UpdateOpsLocationData`;
        return (this.http.post<MissionAssign>(fullDomain + '?id=' + this.ds.getPassKey(), locationData, httpHeaders)
            .pipe(catchError(DataService.errorHandler)));
    }
}
