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

  add(title: string, description: string): void {
    if (!title) {
      return;
    }
    this.qs.addQuestion(title, description);
  }
}
