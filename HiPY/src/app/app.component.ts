import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "HiPY";
  user;
  constructor(db: AngularFirestore, public afAuth: AngularFireAuth) {}
  ngOnInit() {
    this.user = this.afAuth.authState;
  }
}
