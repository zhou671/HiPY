import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { User } from './user';

@Injectable({
  providedIn: "root"
})
export class QuestionService {
  constructor(private afs: AngularFirestore, private router: Router) {}
  Queses: string[];
  allUsers: User[];
  resultLength: number[];
  newEmail: string;
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

  addQuestion(user: string, title: string, description: string) {
    this.afs
      .collection<any>("questions")
      .add({ user: user, title: title, description: description })
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
      .add({ user: user, response: response, likes: 0 })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
  }
  
  addUser(email:string){
    if(!email){
      return;
    }
    console.log("Before oneUser");
    console.log("Email is: " + email);
    this.newEmail = email;
    this.allUsers = [];
    this.Queses = [];
    this.resultLength = [];
    this.afs.collection<any>("users")
      .snapshotChanges()
      .subscribe(ret => this.setUsers(ret));
  }

  setUsers(myUser) {
    console.log("length is: ", myUser.length);
    for(var i = 0; i < myUser.length; i++){
      var id = myUser[i].payload.doc.id;
      var UserEmail = myUser[i].payload.doc.data().UserEmail;
      var Follows = myUser[i].payload.doc.data().Follows;
      var Likes = myUser[i].payload.doc.data().Likes;
      if(new String(UserEmail).valueOf() == new String(this.newEmail).valueOf()){
        this.resultLength.push(0);
        console.log("Return ture when:" + UserEmail + " and " + this.newEmail);
        console.log("It set value " + this.resultLength);
      } else {
        console.log("Comparing:" + UserEmail + " and " + this.newEmail);
      }
      this.allUsers.push({ id ,UserEmail,Follows, Likes});
    }
    if(this.resultLength.length != 0){
      return;
    }
    console.log("Before is OK");
    this.afs
      .collection<any>("users")
      .add({ UserEmail: this.newEmail, Follows: this.Queses })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
      console.log("After is OK");
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

  addLikes(
    questionNumber:string,
    answerNumber:string,
    newlikes:number
  ) {
    // var currentlikes = this.afs
    //   .collection<any>("questions")
    //   .doc<any>(questionNumber)
    //   .collection<any>("answers")
    //   .doc<any>(answerNumber)
    //   .collection
    // console.log("current like is: ", currentlikes);
    this.afs
      .collection<any>("questions")
      .doc<any>(questionNumber)
      .collection<any>("answers")
      .doc<any>(answerNumber)
      .update({likes : newlikes})
      .then(function(){
        console.log("Status saved!");
      })
      .catch(function(error){
        console.log("Got an error: ", error);
      });

  }

  editAnswer(
    questionNumber: string,
    answerNumber: string,
    user: string,
    response: string
  ) {
    //if (user == window.localStorage.getItem("emailForSignIn")) {
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
    //}
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
