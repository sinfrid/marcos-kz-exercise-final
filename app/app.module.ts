import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HTMLMarkerComponent } from './html-marker.component';

import { DataService } from './data.service';


@NgModule({
  imports:      [ BrowserModule, FormsModule,HttpClientModule, LeafletModule.forRoot() ],
  declarations: [ AppComponent, HTMLMarkerComponent ],
  providers: [ DataService ],
  // IMPORTANT! Dynamic components need to be registered here
  entryComponents: [HTMLMarkerComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
