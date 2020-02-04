import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HTMLMarkerComponent } from './html-marker.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataService } from './data.service';
import { SidebarModule } from 'ng-sidebar';

@NgModule({
  imports:      [ BrowserModule, FormsModule,HttpClientModule,NgSelectModule, LeafletModule.forRoot(),SidebarModule.forRoot() ],
  declarations: [ AppComponent, HTMLMarkerComponent ],
  providers: [ DataService ],
  // IMPORTANT! Dynamic components need to be registered here
  entryComponents: [HTMLMarkerComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
