import {Component, OnInit} from '@angular/core';
import {DatastoreService} from './services/datastore.service';
import {DataService} from './services/data.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Operation Fund Synchronization';

    constructor(private ds: DatastoreService, private data: DataService) { }

    ngOnInit() {
        //During initialization, need to identify which server is hosting the latest API.
        if (this.ds.getWSAPI() == '') {
            this.data.setWSServer()
                .subscribe((results) => {
                    this.data.identifyAPIServerLocation(results.api);

                    // During initialization, also need to obtain the authorization token that will be used for all communications
                    this.grabToken();
                });
        }
    }

    private async grabToken() {
        if (localStorage.getItem('token') == 'null') {
            console.log("Grab a bearer token");
            await this.data.getSessionToken()
                .subscribe(
                    (results: any) => {
                        localStorage.setItem('token', results.access_token);
                        console.log('Got the new token', results.access_token);
                    },
                    (err: HttpErrorResponse) => {
                        console.log("Getting error from token grab", err.message);
                    });

            //Token bypass just to keep it operating
            localStorage.setItem("key", this.ds.getPassKey());
        }
    }
}
