import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class QuestionService {
  constructor(private afs: AngularFirestore, private router: Router) {}

  getDocument() {
    return this.afs.doc<any>("questions/question1").snapshotChanges();
  }
}
