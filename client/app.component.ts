import { Component, ViewChild } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { SemanticPopupComponent } from "ng-semantic";
import "rxjs/add/operator/map";

@Component({
    selector: "app",
    template: `<div class="ui container">
    <nav class="ui menu inverted teal huge">
        <a routerLink="home" class="item">Home</a>
        <a routerLink="contact" class="item">Contact</a>
        

        <nav class="menu right">
            <a routerLink="signup" class="item">Signup form</a>
            <a (click)="myPopup.show($event, {position: 'right center'})" *ngIf="!isLogged" class="item">Login</a>
            <a (click)="logout()" *ngIf="isLogged" class="item inverted red">Logout</a>
        </nav>
    </nav>
    
    <sm-popup class="huge" #myPopup>
        <sm-card class="card basic">
            <card-title> Simple login </card-title>
            <card-subtitle>  </card-subtitle>
            <card-content>
                <p><input #nick class="ui input" type="text" name="nick" placeholder="nick"></p>
                <p><input #password class="ui input" type="text" name="password" placeholder="password"></p>
            </card-content>
            
            <sm-button class="bottom attached fluid primary" *ngIf="!isLogged" (click)="login(nick.value,password.value)">Login</sm-button>
            <sm-button class="bottom attached fluid red" *ngIf="isLogged" (click)="logout()">Logout</sm-button>
        </sm-card>
    </sm-popup>
        
    <hello [name]="appName"></hello>
    
    <div class="ui divider"></div>
    
    <router-outlet></router-outlet>
    
    <sm-segment *ngIf="response">
        <div style="word-break: break-all"><b>Hashed:</b> {{response?.password}}</div>
        <div class="ui divider"></div>
        <div style="word-break: break-all"><b>Salt:</b> {{response?.salt}}</div>
    </sm-segment>
    
</div>`
})
export class AppComponent {
    appName: string = "Angular 2 Express";

    isLogged: boolean;
    response: { password: string, salt: string };
    @ViewChild("myPopup") myPopup: SemanticPopupComponent;

    constructor(private http: Http) {
        this.isLogged = !!localStorage.getItem("id_token");
    }

    login(nick,password) {
        this.http.post("/login", JSON.stringify({ 
            password: password,
            nick: nick
         }), new RequestOptions({
            headers: new Headers({"Content-Type": "application/json"})
        }))
            .map((res: Response) => res.json())
            .subscribe(
                (res: Response & { jwt: string }) => {
                    localStorage.setItem("id_token", res.jwt);
                    this.isLogged = true;
                    this.myPopup.hide();
                },
                (error: Error) => { console.log(error); }
            );
    }

    logout(): void {
        localStorage.removeItem("id_token");
        this.isLogged = false;
    }
}