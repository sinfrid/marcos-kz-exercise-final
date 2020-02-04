import { Component, OnInit, ComponentFactoryResolver, ComponentRef, Injector, DoCheck } from '@angular/core';
import { tileLayer, latLng, marker, Marker } from 'leaflet';

import { HTMLMarkerComponent } from './html-marker.component';
import { DataService } from './data.service';

interface MarkerMetaData {
  name: String;
  markerInstance: Marker;
  componentInstance: ComponentRef<HTMLMarkerComponent>
}

@Component({
  selector: 'my-app',
  template: `
    <div style="height: 400px; width: 600px"
      leaflet 
      [leafletOptions]="options"
      (leafletMapReady)="onMapReady($event)">
    </div>
    <button (click)="addMarker()">Add markers</button>
    <button (click)="mutateMarkerData()">Mutate data</button>
    <hr />
    <span *ngFor="let marker of markers" style="border:1px solid black; margin:5px;">{{ marker.name }} <a href="#" (click)="removeMarker(marker)">(remove)</a></span>
  `
})
export class AppComponent implements DoCheck {
  map;
  markers: MarkerMetaData[] = [];
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };

  constructor(private dataService: DataService, private resolver: ComponentFactoryResolver, private injector: Injector){}

  onMapReady(map) {
    // get a local reference to the map as we need it later
    this.map = map;
  }

  addMarker() {
    // simply iterate over the array of markers from our data service
    // and add them to the map
    for(const entry of this.dataService.getMarkers()) {
      // dynamically instantiate a HTMLMarkerComponent
      const factory = this.resolver.resolveComponentFactory(HTMLMarkerComponent);

      // we need to pass in the dependency injector
      const component = factory.create(this.injector);

      // wire up the @Input() or plain variables (doesn't have to be strictly an @Input())
      component.instance.data = entry;

      // we need to manually trigger change detection on our in-memory component
      // s.t. its template syncs with the data we passed in
      component.changeDetectorRef.detectChanges();


      // create a new Leaflet marker at the given position
      let m = marker(entry.position);

      // pass in the HTML from our dynamic component
      const popupContent = component.location.nativeElement;

      // add popup functionality
      m.bindPopup(popupContent).openPopup();

      // finally add the marker to the map s.t. it is visible
      m.addTo(this.map);

      // add a metadata object into a local array which helps us
      // keep track of the instantiated markers for removing/disposing them later
      this.markers.push({
        name: entry.name,
        markerInstance: m,
        componentInstance: component
      });
    }
  }

  removeMarker(marker) {
    // remove it from the array meta objects
    const idx = this.markers.indexOf(marker);
    this.markers.splice(idx, 1);

    // remove the marker from the map
    marker.markerInstance.removeFrom(this.map);

    // destroy the component to avoid memory leaks
    marker.componentInstance.destroy();
  }

  // simulate some change which needs
  // to trigger updates on our dynamic components
  mutateMarkerData() {
    // this provocates changes which the components on the markers have to re-render
    this.dataService.changeMarkerData();
  }

  // This is a lifecycle method of an Angular component which gets invoked whenever for
  // our component change detection is triggered
  ngDoCheck() {
    // since our components are dynamic, we need to manually iterate over them and trigger
    // change detection on them.
    this.markers.forEach(entry => {
      entry.componentInstance.changeDetectorRef.detectChanges();
    })
  }

}
