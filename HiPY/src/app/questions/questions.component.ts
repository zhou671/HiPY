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
  constructor(public qs: QuestionService) {}
  ngOnInit() {
    this.qs.getDocument().subscribe(ret => this.setDocument(ret));
    this.qs.getAllDocuments().subscribe(ret => this.setCollection(ret));
  }

  setDocument(mydoc) {
    const output = document.querySelector("#xyz") as HTMLElement;
    output.innerText = mydoc.payload.data().description;
  }

  setCollection(mycollect) {
    console.log(mycollect.length);
    console.log(mycollect[0].payload.doc.id);
    console.log(mycollect[0].payload.doc.data());
    console.log(mycollect[1].payload.doc.id);
    console.log(mycollect[1].payload.doc.data());
    this.qs
      .getAnswers(mycollect[0].payload.doc.id)
      .subscribe(ret => this.setAnswer(ret));
  }

  setAnswer(myanswer) {
    console.log(myanswer[0].payload.doc.data());
  }
}
