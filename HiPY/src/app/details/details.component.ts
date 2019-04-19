import { Component, OnInit, Input } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";
import { Location } from "@angular/common";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"]
})
export class DetailsComponent implements OnInit {
  //@Input() selectedQuestion: Question;
  myQuestion: Question;
  myAnswers: Answer[];

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService,
    private location: Location
  ) {}

  ngOnInit() {
    this.myAnswers = [];
    this.myQuestion = {};
    const questionNumber = this.route.snapshot.paramMap.get("id");
    this.qs.getQuestion(questionNumber).subscribe(ret => this.setQuestion(ret));
    this.qs.getAnswers(questionNumber).subscribe(ret => this.setAnswer(ret));
  }

  setAnswer(myanswer) {
    console.log(myanswer.length);
    for (var i = 0; i < myanswer.length; i++) {
      var user = myanswer[i].payload.doc.data().user;
      var response = myanswer[i].payload.doc.data().response;
      this.myAnswers.push({ user, response });
      console.log(this.myAnswers[i]);
    }
  }

  setQuestion(myquestion) {
    this.myQuestion.id = myquestion.payload.id;
    this.myQuestion.title = myquestion.payload.data().title;
    this.myQuestion.description = myquestion.payload.data().description;
  }
}
