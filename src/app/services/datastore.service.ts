import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor() { }

  //Variables
  private _passKey: string = "4A3F6BD3-61FB-467B-83D0-0EFBAF72AFC4";
  private _connectid: string  = 'MobCopConnectionString';
  private _appVersion: string = '2.0.0 (BETA)';
  private _apiServer: string = "";
  private _apiLocation: string = "";

  curSelectedButton: string = "";
  tblColumns:any = {};
  tblData:any = {};
  opsData: any = {};
  btnData: any[] = [
                    ["damps","ID"], ["orders","ID"], ["pay","ID"],["tcs","ID"], ["conusa","ID"], 
                    ["locations","ID"], ["fundcites","ID"], ["operations","ID"], ["tpfdd","ID"], ["cycles","ID"]
                  ];
  btnStatus: boolean[] = [false, false, false, false, false, false, false, false, false, false];
  columnHeaders = {};
  curSelectedRecord: any = null;
  
  // Getter and Setters
  getPassKey() {
    return this._passKey;
  }

  getVersion() {
    return this._appVersion;
  }

  getWSAPI() {
    return this._apiServer;
  }

  getAPILocation() {
    return this._apiLocation;
  }

  setWSAPI(url: string, location: string) {
    this._apiServer = url;
    this._apiLocation = location;
  }

   /// Global Services
  public getSelectedRow(arr: any, id: number) {
    return arr.find(x => x.ID == id);
  }

  public getArrayIndex(arr: any, value: any) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == value)
        return i;
    }
  }

  public getBtnStatus(title: string) {
    return this.btnStatus[this.getArrayIndex(this.btnData, title)];
  }
}
