import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../question.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Question } from "../question";
import { Answer } from "../answer";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  searchedQuestions: Question[];

  constructor(public qs: QuestionService) {}

  ngOnInit() {
    this.searchedQuestions = [];
  }

  prepareSearch(qTitle: string) {
    //console.log(qTitle);
    var collecRef = this.qs.getSearchedQuestions(qTitle);
    collecRef.get().subscribe(ret => this.setQuestion(ret));
  }

  setQuestion(query) {
    this.searchedQuestions = [];
    for (var i = 0; i < query.size; i++) {
      var id = query.docs[i].id;
      var title = query.docs[i].data().title;
      var description = query.docs[i].data().description;
      var user = query.docs[i].data().user;
      this.searchedQuestions.push({ id, title, description, user });
      //console.log(this.searchedQuestions[i]);
    }
  }
}
