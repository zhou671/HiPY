import { Component, OnInit, Input } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";
import { Location } from "@angular/common";

@Component({
  selector: "app-edit-question",
  templateUrl: "./edit-question.component.html",
  styleUrls: ["./edit-question.component.css"]
})
export class EditQuestionComponent implements OnInit {
  questionNumber;
  @Input() myQuestion: Question;

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService,
    private location: Location
  ) {}

  ngOnInit() {
    this.questionNumber = this.route.snapshot.paramMap.get("id");
    this.myQuestion = { id: "", title: "", description: "" };
    this.qs
      .getQuestion(this.questionNumber)
      .subscribe(ret => this.setQuestion(ret));
  }

  setQuestion(ret) {
    this.myQuestion.title = ret.payload.data().title;
    this.myQuestion.description = ret.payload.data().description;
    console.log(this.myQuestion);
  }

  goBack() {
    this.location.back();
  }

  save() {
    this.qs.editQuestion(
      this.questionNumber,
      this.myQuestion.title,
      this.myQuestion.description
    );
    this.goBack();
  }
}
