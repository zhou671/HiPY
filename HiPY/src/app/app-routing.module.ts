import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuestionComponent } from "./create-question/create-question.component";
import { CreateAnswerComponent } from "./create-answer/create-answer.component";
import { DetailsComponent } from "./details/details.component";
import { QuestionsComponent } from "./questions/questions.component";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
  { path: "questions", component: QuestionsComponent },
  { path: "create", component: CreateQuestionComponent },
  { path: "create-answer/:id", component: CreateAnswerComponent },
  { path: "details/:id", component: DetailsComponent },
  { path: "search", component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
