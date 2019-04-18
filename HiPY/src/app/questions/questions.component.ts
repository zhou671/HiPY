import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Component({
  selector: "app-questions",
  templateUrl: "./questions.component.html",
  styleUrls: ["./questions.component.css"]
})
export class QuestionsComponent implements OnInit {
  mytitle: String;
  myDescription: String;

  constructor(public qs: QuestionService) {}
  ngOnInit() {
    //this.qs.getDocument().subscribe(doc => console.log(doc.payload.data()));
    this.qs.getDocument().subscribe(doc => this.set(doc));
  }

  set(doc) {
    this.mytitle = doc.payload.data().title;
    this.myDescription = doc.payload.data().description;
    const output = document.querySelector("#xyz");
    output.innerText = this.myDescription;
  }
}
