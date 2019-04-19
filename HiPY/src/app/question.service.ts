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

  getAnswer(questionID: string, answerID: string) {
    return this.afs
      .collection<any>("questions")
      .doc<any>(questionID)
      .collection<any>("answers")
      .doc<any>(answerID)
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

  addAnswer(questionID: string, user: string, response: string) {
    this.afs
      .collection<any>("questions")
      .doc<any>(questionID)
      .collection<any>("answers")
      .add({ user: user, response: response })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
  }

  getSearchedQuestions(title: string) {
    return this.afs.collection<any>("questions", ref =>
      ref.where("title", "==", title)
    );
  }

  deleteAnswer(questionID: string, answerID: string) {
    this.afs
      .collection("questions")
      .doc(questionID)
      .collection("answers")
      .doc(answerID)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  }

  editAnswer(questionNumber: string, answerNumber: string, response: string) {
    this.afs
      .collection<any>("questions")
      .doc<any>(questionNumber)
      .collection<any>("answers")
      .doc<any>(answerNumber)
      .update({ response: response })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
  }

  editQuestion(questionNumber: string, title: string, description: string) {
    this.afs
      .collection<any>("questions")
      .doc<any>(questionNumber)
      .update({ title: title, description: description })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
  }
}
