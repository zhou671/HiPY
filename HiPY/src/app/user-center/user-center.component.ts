import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";
import { User } from "../user"

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css']
})
export class UserCenterComponent implements OnInit {

  user;
  email: string;
  emailSent = false;
  myQuestions: Question[];
  questionIds: string[];
  errorMessage: string;
  Queses: string[];
  allUsers: User[];
  resultLength: number[];
  newEmail: string;
  todelete: Question;
  constructor(
    public qs: QuestionService,
    public afs: AngularFirestore,
  ) {}

  ngOnInit() {
    console.log(window.localStorage.getItem("emailForSignIn"));
    this.newEmail = window.localStorage.getItem("emailForSignIn");
    this.email = this.newEmail;
    this.myQuestions = [];
    this.questionIds = [];
    this.Queses = [];
    this.allUsers = [];
    this.resultLength = [];
    this.findUser();
  }

  findUser() {
    this.afs.collection<any>("users")
      .snapshotChanges()
      .subscribe(ret => this.setAllQues(ret));
  }

  setAllQues(myUser) {
    var findit = false;
    var Follows;
    var id;
    for(var i = 0; i < myUser.length; i++) {
      id = myUser[i].payload.doc.id;
      var UserEmail = myUser[i].payload.doc.data().UserEmail;
      Follows = myUser[i].payload.doc.data().Follows;
      if(new String(UserEmail).valueOf() == new String(this.email).valueOf()){
        findit = true;
        break;
      }
    }
    console.log("User id is: ", id);
    if(!findit){
      return;
    }
    this.questionIds = Follows;
    console.log("Follows Info: " + this.questionIds);
    this.afs
      .collection<any>("questions")
      .snapshotChanges().subscribe(ret => this.setQuestions(ret));
  }

  setQuestions(myquestion){
    if(this.myQuestions.length != 0){
      this.myQuestions = [];
    }
    for(var i = 0; i < myquestion.length; i++){
      var id = myquestion[i].payload.doc.id;
      var title = myquestion[i].payload.doc.data().title;
      var description = myquestion[i].payload.doc.data().description;
      var user = myquestion[i].payload.doc.data().user;
      for (var j = 0; j < this.questionIds.length; j++) {
        if(new String(id).valueOf() == new String(this.questionIds[j]).valueOf()) {
          this.myQuestions.push({ id, title, description, user });
          break;
        }
      }
    }
    console.log(this.myQuestions);
  }

  deleteQues4User(toDelete) {
    this.todelete = toDelete;
    this.afs.collection<any>("users")
      .snapshotChanges()
      .subscribe(ret => this.deleteFoll(ret));
  }

  deleteFoll(myUser) {
    var findit = false;
    var Follows;
    var id;
    for(var i = 0; i < myUser.length; i++)
    {
      id = myUser[i].payload.doc.id;
      var UserEmail = myUser[i].payload.doc.data().UserEmail;
      Follows = myUser[i].payload.doc.data().Follows;
      console.log("email: " + UserEmail);
      if(new String(UserEmail).valueOf() === new String(this.email).valueOf()){
        findit = true;
        console.log("Find it");
        break;
      }
    }
    if(!findit){
      return;
    }
    findit = false;
    for(var i = 0; i < Follows.length; i++){
      if(new String(Follows[i]).valueOf() == new String(this.todelete.id).valueOf()){
        findit = true;
        break;
      }
    }
    if(findit){
      return;
    }
    Follows.array.forEach( (item, index) => {
      if(item === this.todelete.id) Follows.splice(index, 1);
    });
    this.afs
      .collection<any>("users")
      .doc<any>(id)
      .update({ Follows : Follows })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
    console.log("Reach Here");
  }
}
