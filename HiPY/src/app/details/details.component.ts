import { Component, OnInit, Input } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";
import { Location } from "@angular/common";
import { debounceTime, distinctUntilChanged, switchMap, find } from "rxjs/operators";
import { PasswordlessAuthComponent } from "../passwordless-auth/passwordless-auth.component";
import { AngularFireAuth } from "@angular/fire/auth";


@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"]
})
export class DetailsComponent implements OnInit {
  myQuestion: Question;
  myAnswers: Answer[];
  currentUser: string;
  UserId: string;
  following = false;
  Userfollow : string[];
  Userlikes:string[];
  //myauth: PasswordlessAuthComponent;

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService,
    private afs: AngularFirestore,
    private location: Location,
    private auth: AngularFireAuth
  ) {}

  ngOnInit() {
    //console.info('User test: ' , this.auth.user);
    //console.info('The current user is ' + window.localStorage.getItem("emailForSignIn"));
    this.currentUser = window.localStorage.getItem("emailForSignIn");
    //console.info('test1');
    //console.info("test2");
    //console.info('Try test: ' + this.myauth.user);

    this.myAnswers = [];
    this.Userfollow = [];
    this.Userlikes = [];
    this.myQuestion = { id: "", title: "", description: "", user: "" };
    const questionNumber = this.route.snapshot.paramMap.get("id");
    this.qs.getQuestion(questionNumber).subscribe(ret => this.setQuestion(ret));
    this.qs.getAnswers(questionNumber).subscribe(ret => this.setAnswer(ret));
    //this.checkUser(); 
  }

  checkUser() {
    this.afs.collection<any>("users")
      .snapshotChanges()
      .subscribe(ret => this.checkfollowing(ret));
  }

  checkfollowing(myUser) {
    var findit = false;
    var Follows;
    var id;
    var Likes;
    for(var i = 0; i < myUser.length; i++)
    {
      id = myUser[i].payload.doc.id;
      var UserEmail = myUser[i].payload.doc.data().UserEmail;
      Follows = myUser[i].payload.doc.data().Follows;
      Likes = myUser[i].payload.doc.data().Likes;
      if(new String(UserEmail).valueOf() == new String(this.currentUser).valueOf()){
        findit = true;
        break;
      }
    }
    if(!findit){
      return;
    }
    this.UserId = id;
    findit = false;
    for(var i = 0; i < Follows.length; i++){
      if(new String(Follows[i]).valueOf() == new String(this.myQuestion.id).valueOf()){
        findit = true;
        break;
      }
    }
    this.following = findit;
    this.Userfollow = Follows;
    this.Userlikes = Likes;
    this.checklikes();
  }

  checklikes() {
    // f**king O(n) algo, go with O(n^2) anyway, time is money my friend
    for(var i = 0; i < this.myAnswers.length; i++){
      this.myAnswers[i].liked = false;
    }
    for(var i = 0; i < this.myAnswers.length; i++){
      for(var j = 0; j < this.Userlikes.length; j++){
        if(
          new String(this.myAnswers[i].id).valueOf() == 
          new String(this.Userlikes[j]).valueOf()
        ) {
          this.myAnswers[i].liked = true;
          break;
        }
      }
    }
  }

  addQues2User() {
    this.Userfollow.push(this.myQuestion.id);
    this.afs
    .collection<any>("users")
    .doc<any>(this.UserId)
    .update({ Follows : this.Userfollow })
    .then(function() {
      console.log("Status saved!");
    })
    .catch(function(error) {
      console.log("Got an error: ", error);
    });
    this.following = true;
  }

  deleteQues4User(){
    this.Userfollow.forEach( (item, index) => {
      if(item === this.myQuestion.id) this.Userfollow.splice(index, 1);
    });
    this.afs
    .collection<any>("users")
    .doc<any>(this.UserId)
    .update({ Follows : this.Userfollow })
    .then(function() {
      console.log("Status saved!");
    })
    .catch(function(error) {
      console.log("Got an error: ", error);
    });
    this.following = false;
  }

  setAnswer(myanswer) {
    if(this.myAnswers.length != 0){
      this.myAnswers = [];
    }
    for (var i = 0; i < myanswer.length; i++) {
      var id = myanswer[i].payload.doc.id;
      var user = myanswer[i].payload.doc.data().user;
      var response = myanswer[i].payload.doc.data().response;
      var likes = myanswer[i].payload.doc.data().likes;
      this.myAnswers.push({ id, user, response, likes });
    }
    this.checkUser(); 
  }

  setQuestion(myquestion) {
    this.myQuestion.id = myquestion.payload.id;
    this.myQuestion.title = myquestion.payload.data().title;
    this.myQuestion.description = myquestion.payload.data().description;
    this.myQuestion.user = myquestion.payload.data().user;
  }

  deleteanswer(answer) {
    //this.qs.deleteAnswer(this.myQuestion.id, answer.id);
    this.deleteAnswerX(this.myQuestion.id, answer.id, this);
  }

  deleteAnswerX(questionID: string, answerID: string, self) {
    //document.getElementById("answerlist").style.display = "none";

    this.afs
      .collection("questions")
      .doc(questionID)
      .collection("answers")
      .doc(answerID)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
        //window.location.reload();
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  }

  addlikes(answer){
    var num = answer.likes + 1;
    this.qs.addLikes(this.myQuestion.id, answer.id, num);
    for(var i = 0; i < this.myAnswers.length; i++){
      if(new String(this.myAnswers[i]).valueOf() == new String(answer.id).valueOf()){
        this.myAnswers[i].liked = true;
        break;
      }
    }
    console.log(this.myAnswers);
    this.Userlikes.push(answer.id);
    this.afs.collection<any>("users").doc(this.UserId).update({Likes : this.Userlikes});
  }

  deletelikes(answer){
    var num = answer.likes - 1;
    this.qs.addLikes(this.myQuestion.id, answer.id, num);
    for(var i = 0; i < this.myAnswers.length; i++){
      if(new String(this.myAnswers[i]).valueOf() == new String(answer.id).valueOf()){
        this.myAnswers[i].liked = false;
        break;
      }
    }
    console.log(this.myAnswers);
    this.Userlikes.forEach( (item, index) => {
      if(item === answer.id) this.Userlikes.splice(index, 1);
    });
    this.afs.collection<any>("users").doc(this.UserId).update({Likes : this.Userlikes});
  }
}
