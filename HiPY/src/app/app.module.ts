import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "../environments/environment";
import { QuestionsComponent } from "./questions/questions.component";
import { DetailsComponent } from "./details/details.component";
import { CreateQuestionComponent } from "./create-question/create-question.component";
import { CreateAnswerComponent } from "./create-answer/create-answer.component";
import { SearchComponent } from "./search/search.component";

@NgModule({
  declarations: [
    AppComponent,
    QuestionsComponent,
    DetailsComponent,
    CreateQuestionComponent,
    CreateAnswerComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
