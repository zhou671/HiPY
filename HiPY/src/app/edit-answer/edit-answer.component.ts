import { Component, OnInit, Input } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";
import { Location } from "@angular/common";

@Component({
  selector: "app-edit-answer",
  templateUrl: "./edit-answer.component.html",
  styleUrls: ["./edit-answer.component.css"]
})
export class EditAnswerComponent implements OnInit {
  questionNumber;
  answerNumber;
  @Input() myAnswer: Answer;

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService,
    private location: Location
  ) {}

  ngOnInit() {
    this.questionNumber = this.route.snapshot.paramMap.get("qid");
    this.answerNumber = this.route.snapshot.paramMap.get("aid");
    this.myAnswer = { id: "", user: "", response: "" };
    this.qs
      .getAnswer(this.questionNumber, this.answerNumber)
      .subscribe(ret => this.setAnswer(ret));
  }

  setAnswer(ret) {
    this.myAnswer.user = ret.payload.data().user;
    this.myAnswer.response = ret.payload.data().response;
    console.log(this.myAnswer);
  }

  goBack() {
    this.location.back();
  }
  save() {
    this.qs.editAnswer(
      this.questionNumber,
      this.answerNumber,
      this.myAnswer.response
    );
    this.goBack();
  }
}
