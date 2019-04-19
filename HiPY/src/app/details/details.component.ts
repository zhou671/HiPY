import { Component, OnInit, Input } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";
import { Location } from "@angular/common";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"]
})
export class DetailsComponent implements OnInit {
  myQuestion: Question;
  myAnswers: Answer[];

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService,
    private afs: AngularFirestore,
    private location: Location
  ) {}

  ngOnInit() {
    this.myAnswers = [];
    this.myQuestion = { id: "", title: "", description: "" };
    const questionNumber = this.route.snapshot.paramMap.get("id");
    this.qs.getQuestion(questionNumber).subscribe(ret => this.setQuestion(ret));
    this.qs.getAnswers(questionNumber).subscribe(ret => this.setAnswer(ret));
  }

  setAnswer(myanswer) {
    for (var i = 0; i < myanswer.length; i++) {
      var id = myanswer[i].payload.doc.id;
      var user = myanswer[i].payload.doc.data().user;
      var response = myanswer[i].payload.doc.data().response;
      this.myAnswers.push({ id, user, response });
    }
  }

  setQuestion(myquestion) {
    this.myQuestion.id = myquestion.payload.id;
    this.myQuestion.title = myquestion.payload.data().title;
    this.myQuestion.description = myquestion.payload.data().description;
  }

  deleteanswer(answer) {
    //this.qs.deleteAnswer(this.myQuestion.id, answer.id);
    this.deleteAnswerX(this.myQuestion.id, answer.id, this);
  }

  deleteAnswerX(questionID: string, answerID: string, self) {
    document.getElementById("answerlist").style.display = "none";

    this.afs
      .collection("questions")
      .doc(questionID)
      .collection("answers")
      .doc(answerID)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
        window.location.reload();
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  }
}
