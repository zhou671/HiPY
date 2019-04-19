import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";

@Component({
  selector: "app-questions",
  templateUrl: "./questions.component.html",
  styleUrls: ["./questions.component.css"]
})
export class QuestionsComponent implements OnInit {
  myQuestions: Question[];

  constructor(public qs: QuestionService) {}

  ngOnInit() {
    this.myQuestions = [];
    this.qs.getAllQuestions().subscribe(ret => this.setCollection(ret));
  }

  setCollection(mycollect) {
    for (var i = 0; i < mycollect.length; i++) {
      var id = mycollect[i].payload.doc.id;
      var title = mycollect[i].payload.doc.data().title;
      var description = mycollect[i].payload.doc.data().description;

      this.myQuestions.push({ id, title, description });
      //console.log(this.myQuestions[i]);
    }
  }
}
