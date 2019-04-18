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
  docuemnt: any;

  constructor(public qs: QuestionService) {}

  ngOnInit() {
    //this.document = this.qs.getDocument();
    this.qs.getDocument().subscribe(doc => console.log(doc.payload.data()));
  }
}
