import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-create-question",
  templateUrl: "./create-question.component.html",
  styleUrls: ["./create-question.component.css"]
})
export class CreateQuestionComponent implements OnInit {
  constructor(private qs: QuestionService) {}

  ngOnInit() {}

  add(user: string, title: string, description: string): void {
    if (!title) {
      return;
    }
    user = window.localStorage.getItem("emailForSignIn");

    this.qs.addQuestion(user, title, description);
  }
}
