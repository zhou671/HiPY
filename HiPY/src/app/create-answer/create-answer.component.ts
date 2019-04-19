import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-create-answer",
  templateUrl: "./create-answer.component.html",
  styleUrls: ["./create-answer.component.css"]
})
export class CreateAnswerComponent implements OnInit {
  questionNumber;

  constructor(private qs: QuestionService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.questionNumber = this.route.snapshot.paramMap.get("id");
  }

  add(user: string, response: string) {
    if (!response) {
      return;
    }
    this.qs.addAnswer(this.questionNumber, user, response);
  }
}
