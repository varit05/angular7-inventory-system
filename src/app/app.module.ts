import { environment } from "../environments/environment";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { ExcelService } from "./shared/services/excel.service"

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AngularFireModule.initializeApp(
      environment.firebase
    ),
    AngularFireDatabaseModule
  ],
  providers: [ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule {}
