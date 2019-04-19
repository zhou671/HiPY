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
  myAnswers: Answer[];

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService,
    private location: Location
  ) {}

  ngOnInit() {
    this.myAnswers = [];
    const questionNumber = this.route.snapshot.paramMap.get("id");
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
}
