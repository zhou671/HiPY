import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuestionComponent } from "./create-question/create-question.component";
import { DetailsComponent } from "./details/details.component";
import { QuestionsComponent } from "./questions/questions.component";

const routes: Routes = [
  { path: "questions", component: QuestionsComponent },
  { path: "details", component: DetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
