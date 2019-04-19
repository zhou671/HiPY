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

  getAllQuestions() {
    return this.afs.collection<any>("questions").snapshotChanges();
  }

  getQuestion(questionID: string) {
    return this.afs
      .collection<any>("questions")
      .doc<any>(questionID)
      .snapshotChanges();
  }

  getAnswers(questionID: string) {
    return this.afs
      .collection<any>("questions")
      .doc<any>(questionID)
      .collection<any>("answers")
      .snapshotChanges();
  }

  addQuestion(title: string, description: string) {
    this.afs
      .collection<any>("questions")
      .add({ title: title, description: description })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
  }
}
