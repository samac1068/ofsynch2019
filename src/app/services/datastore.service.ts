import { Injectable } from '@angular/core';
import {AGEditIconRendererComponent} from '../components/renderers/AGEditIconRendererComponent';
import {AGCheckBoxRendererComponent} from '../components/renderers/AGCheckBoxRendererComponent';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor() { }

  //Variables
  private _passKey: string = "4A3F6BD3-61FB-467B-83D0-0EFBAF72AFC4";
  private _connectid: string  = 'MobCopConnectionString';
  private _appVersion: string = '2.0.20.0310';
  private _apiServer: string = "";
  private _apiLocation: string = "";

  curSelectedButton: string = "";
  tblColumns:any = {};
  tblData:any = {};
  opsData: any = {};
  btnData: any[] = [
                    ["damps","ID"], ["orders","ID"], ["pay","ID"],["tcs","ID"], ["conusa","ID"], 
                    ["missionlocations","ID"], ["fundcites","ID"], ["operations","ID"], ["tpfdd","ID"], ["cycles","ID"]
                  ];
  btnStatus: boolean[] = [false, false, false, false, false, false, false, false, false, false];
  columnHeaders = {};
  curSelectedRecord: any = null;
  acknowTitle: string = "Operation Status";

  dgColumnData: any = {
      "damps":
          [
              {"headerName": "Edit", "field": "ID", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "ID", "field": "ID" },
              {"headerName": "Hidden", "field": "opHidden", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "Description", "field": "Description", "filter": true},
              {"headerName": "Pay OP", "field": "PAY_Operation", "filter": true},
              {"headerName": "TCS OP", "field": "TCS_Operation", "filter": true},
              {"headerName": "Short Name", "field": "opShortName", "filter": true},
              {"headerName": "Record Status", "field": "Record_Status_Description", "filter": true},
              {"headerName": "Transfer Status", "field": "Transfer_Status_Description",  "filter": true},
              {"headerName": "12301D", "field": "ma12301_d", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "12302", "field": "ma12302", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "12304", "field": "ma12304", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "12304A", "field": "ma12304_a", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "12304B", "field": "ma12304_b", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "12302 Corona", "field": "ma12302_Corona", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "MOBCAP", "field": "MOBCAP", "filter": true},
              {"headerName": "Cycle", "field": "Cycle", "filter": true},
              {"headerName": "Long Name", "field": "opLongName", "filter": true},
              {"headerName": "UIC to NIPR", "field": "UIC_ToNipr", "cellRendererFramework": AGCheckBoxRendererComponent}
          ],
      "orders":
          [
              {"headerName": "Edit", "field": "id", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "Visible", "field": "isVisible", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "ID", "field": "id", "filter": true},
              {"headerName": "OPERATION", "field": "operation", "filter": true},
              {"headerName": "CYCLE", "field": "cycle", "filter": true},
              {"headerName": "IN PLANNING", "field": "plan_id", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "ORDERS", "field": "ord_id", "filter": true },
              {"headerName": "ASSIGNED DAMPS", "field": "Description", "filter": true }
          ],
      "pay":
          [
              {"headerName": "Edit", "field": "PAY_Operation_ID", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "ID", "field": "PAY_Operation_ID", "filter": true },
              {"headerName": "OPERATION", "field": "PAY_Operation", "filter": true },
              {"headerName": "DESCRIPTION", "field": "PAY_Operation_Description", "filter": true },
              {"headerName": "RECORD STATUS", "field": "Record_Status_Description", "filter": true },
              {"headerName": "TRANSFER STATUS", "field": "Transfer_Status_Description", "filter": true }
          ],
      "tcs":
          [
              {"headerName": "Edit", "field": "TCS_Operation_ID", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "ID", "field": "TCS_Operation_ID", "filter": true },
              {"headerName": "OPERATION", "field": "TCS_Operation", "filter": true },
              {"headerName": "DESCRIPTION", "field": "TCS_Operation_Description", "filter": true },
              {"headerName": "RECORD STATUS", "field": "Record_Status_Description", "filter": true },
              {"headerName": "TRANSFER STATUS", "field": "Transfer_Status_Description", "filter": true }
          ],
      "conusa":
          [
              {"headerName": "Edit", "field": "opId", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "ID", "field": "opId", "filter": true },
              {"headerName": "SHORTNAME", "field": "opShortName", "filter": true },
              {"headerName": "LONGNAME", "field": "opLongName", "filter": true },
              {"headerName": "AUTH ID", "field": "opAuthId", "filter": true },
              {"headerName": "HIDDEN", "field": "opHidden", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "RECORD STATUS", "field": "Record_Status_Description", "filter": true },
              {"headerName": "TRANSFER STATUS", "field": "Transfer_Status_Description", "filter": true }
          ],
      "operations":
          [
              {"headerName": "Edit", "field": "op_id", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "ID", "field": "op_id", "filter": true },
              {"headerName": "OPERATION", "field": "operation", "filter": true },
              {"headerName": "VISIBLE", "field": "unitrqmt_visible", "cellRendererFramework": AGCheckBoxRendererComponent  },
              {"headerName": "LONG NAME", "field": "operation_long", "filter": true },
              {"headerName": "TO CRC", "field": "CRC", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "TO NIPR", "field": "toNIPR", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "LOC ASGND", "field": "assignedCnt", "filter": true },
              {"headerName": "SPT CMD", "field": "sptcmd", "filter": true },
              {"headerName": "FUNDING", "field": "funding", "filter": true },
              {"headerName": "MOBSLIDE NAME", "field": "mobslide_opname", "filter": true }
          ],
      "cycles":
          [
              {"headerName": "Edit", "field": "CYC_ID", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "CYCLE ID", "field": "CYC_ID", "filter": true },
              {"headerName": "CYCLE", "field": "cycle", "filter": true },
              {"headerName": "FY", "field": "FY", "filter": true },
              {"headerName": "HIDDEN", "field": "opHidden", "cellRendererFramework": AGCheckBoxRendererComponent},
              {"headerName": "RECORD STATUS", "field": "Record_Status_Description", "filter": true },
              {"headerName": "TRANSFER STATUS", "field": "Transfer_Status_Description", "filter": true }
          ],
      "missionlocations":
          [
              {"headerName": "Edit", "field": "lngMissionLocationID", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "ID", "field": "lngMissionLocationID", "filter": true },
              {"headerName": "HIDDEN", "field": "opHidden", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "LOCATION", "field": "strMissionLocation", "filter": true},
              {"headerName": "CONUS", "field": "MissionConus", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "COUNTRY", "field": "Country", "filter": true },
              {"headerName": "COUNTRY CODE", "field": "CountryCode", "filter": true },
              {"headerName": "STATE", "field": "STATEAB", "filter": true },
              {"headerName": "ZIP CODE", "field": "ZipCode", "filter": true },
              {"headerName": "INSTALLATION", "field": "Installation", "filter": true },
              {"headerName": "GEO LOCATION", "field": "GeoLocation", "filter": true },
              {"headerName": "GEO COORDS", "field": "Geographic_Coord", "filter": true },
              {"headerName": "LATITUDE", "field": "Latitude", "filter": true },
              {"headerName": "LONGITUDE", "field": "Longitude", "filter": true },
              {"headerName": "UNC ONTRY CODE", "field": "UN_CC", "filter": true },
              {"headerName": "ARLOC", "field": "UN_CC", "filter": true },
              {"headerName": "COMBAT ZONE", "field": "CZ", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "RECORD STATUS", "field": "Record_Status_Description", "filter": true },
              {"headerName": "TRANSFER STATUS", "field": "Transfer_Status_Description", "filter": true }
          ],
      "fundcites":
          [
              {"headerName": "Edit", "field": "FundId", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "FUND ID", "field": "FundId", "filter": true },
              {"headerName": "FUND CODE", "field": "FundCode", "filter": true,},
              {"headerName": "EFFECTIVE DATE", "field": "FundEffDate", "filter": true },
              {"headerName": "FUND TYPE", "field": "FundTypeName", "filter": true },
              {"headerName": "CIC", "field": "CIC", "filter": true },
              {"headerName": "MDC", "field": "MDC", "filter": true },
              {"headerName": "CONUS BASED", "field": "IsConusBased", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "FY1", "field": "FY1", "filter": true },
              {"headerName": "FY2", "field": "FY2", "filter": true },
              {"headerName": "FY3", "field": "FY3", "filter": true },
              {"headerName": "DEPT", "field": "DEPT", "filter": true },
              {"headerName": "FY", "field": "FY", "filter": true },
              {"headerName": "BSN", "field": "BSN", "filter": true },
              {"headerName": "LIMIT", "field": "LIMIT", "filter": true },
              {"headerName": "OA", "field": "OA", "filter": true },
              {"headerName": "ASN", "field": "ASN", "filter": true },
              {"headerName": "AMS", "field": "AMS", "filter": true },
              {"headerName": "EOR", "field": "EOR", "filter": true },
              {"headerName": "MDEP", "field": "MDEP", "filter": true },
              {"headerName": "FCC", "field": "FCC", "filter": true },
              {"headerName": "STATUS ID", "field": "STATUS_ID", "filter": true },
              {"headerName": "APC", "field": "APC", "filter": true },
              {"headerName": "FSN", "field": "FSN", "filter": true }
          ],
      "tpfdd":
          [
              {"headerName": "Edit", "field": "PID", "cellRendererFramework": AGEditIconRendererComponent },
              {"headerName": "PID", "field": "PID", "filter": true },
              {"headerName": "OPERATION", "field": "DESCRIPTION_SHORT", "filter": true },
              {"headerName": "DESCRIPTION", "field": "DESCRIPTION_LONG", "filter": true },
              {"headerName": "CDATE", "field": "CDATE", "filter": true },
              {"headerName": "TYPE", "field": "TYPE", "filter": true },
              {"headerName": "ACTIVE", "field": "ACTIVE", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "DEPLOY", "field": "DEPLOY", "cellRendererFramework": AGCheckBoxRendererComponent },
              {"headerName": "OPERATION", "field": "operation", "filter": true }
          ]
  };

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

   /// Global Services and functions
  public getSelectedRow(arr: any, id: number) {
    return arr.find(x => x.ID == id);
  }

  public getArrayIndex(arr: any, value: any) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == value)
        return i;
    }

    return -1;
  }

  public get2DArrayIndex(arr: any, col: string, value: any): number {
     for(var i = 0; i < arr.length; i++) {
         if (arr[i][col] == value)
             return i;
     }

     return -1;
  }

  public getBtnStatus(title: string) {
    return this.btnStatus[this.getArrayIndex(this.btnData, title)];
  }
}
