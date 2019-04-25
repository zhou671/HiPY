import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { QuestionService } from "../question.service";
import { Question } from "../question";
import { User } from "../user";

@Component({
  selector: "passwordless-auth",
  templateUrl: "./passwordless-auth.component.html",
  styleUrls: ["./passwordless-auth.component.css"]
})
export class PasswordlessAuthComponent implements OnInit {
  user;
  email: string;
  emailSent = false;
  myQuestions: Question[];
  questionIds: string[];
  errorMessage: string;
  Queses: string[];
  allUsers: User[];
  newLikes: string[];
  resultLength: number[];
  newEmail: string;
  todelete: Question;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private qs: QuestionService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.user = this.afAuth.authState;

    const url = this.router.url;
    this.myQuestions = [];
    this.questionIds = [];
    this.Queses = [];
    this.newLikes = [];
    if (url.includes("signIn")) {
      this.confirmSignIn(url);
    }
  }

  async sendEmailLink() {
    const actionCodeSettings = {
      url: "https://hipy-ffa6a.firebaseapp.com/login",
      //url: "http://localhost:4200/login",
      handleCodeInApp: true
    };

    try {
      await this.afAuth.auth.sendSignInLinkToEmail(
        this.email,
        actionCodeSettings
      );
      console.log(this.email);
      this.addUser(this.email);
      window.localStorage.setItem("emailForSignIn", this.email);
      this.emailSent = true;
      // this.qs.addUser(this.email);
      // console.log("after addusers");
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  async confirmSignIn(url) {
    try {
      if (this.afAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem("emailForSignIn");

        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt("Please provide your email for confirmation");
        }
        // Signin user and remove the email localStorage
        const result = await this.afAuth.auth.signInWithEmailLink(email, url);
        //window.localStorage.removeItem("emailForSignIn");
        //console.log(this.email);
        //this.qs.addUser(this.email);
      }
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  addUser(email: string) {
    if (!email) {
      return;
    }
    console.log("Before oneUser");
    console.log("Email is: " + email);
    this.newEmail = email;
    this.allUsers = [];
    this.Queses = [];
    this.resultLength = [];
    this.afs
      .collection<any>("users")
      .snapshotChanges()
      .subscribe(ret => this.setUsers(ret));
  }

  setUsers(myUser) {
    console.log("length is: ", myUser.length);
    for (var i = 0; i < myUser.length; i++) {
      var id = myUser[i].payload.doc.id;
      var UserEmail = myUser[i].payload.doc.data().UserEmail;
      var Follows = myUser[i].payload.doc.data().Follows;
      var Likes = myUser[i].payload.doc.data().Likes;
      if (
        new String(UserEmail).valueOf() == new String(this.newEmail).valueOf()
      ) {
        this.resultLength.push(0);
        console.log("Return ture when:" + UserEmail + " and " + this.newEmail);
        console.log("It set value " + this.resultLength);
      } else {
        console.log("Comparing:" + UserEmail + " and " + this.newEmail);
      }
      this.allUsers.push({ id, UserEmail, Follows, Likes });
    }
    if (this.resultLength.length != 0) {
      //this.findUser();
      return;
    }
    console.log("Before is OK");
    this.afs
      .collection<any>("users")
      .add({
        UserEmail: this.newEmail,
        Follows: this.Queses,
        Likes: this.newLikes
      })
      .then(function() {
        console.log("Status saved!");
      })
      .catch(function(error) {
        console.log("Got an error: ", error);
      });
    console.log("After is OK");
    //this.findUser();
  }

  logout() {
    window.localStorage.setItem("emailForSignIn", "anonymous");
    return this.afAuth.auth.signOut();
  }
}
