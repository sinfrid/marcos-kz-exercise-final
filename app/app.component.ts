import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  DoCheck,
  NgModule,
  ViewChild
} from "@angular/core";

import { tileLayer, latLng, marker, Marker } from "leaflet";
import { HTMLMarkerComponent } from "./html-marker.component";
import { DataService } from "./data.service";
import {
  NgSelectModule,
  NgOption,
  NgSelectComponent
} from "@ng-select/ng-select";

interface MarkerMetaData {
  name: String;
  markerInstance: Marker;
  componentInstance: ComponentRef<HTMLMarkerComponent>;
}

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements DoCheck {
  isbeingSearched: boolean = false;
  @ViewChild("select1") select1Comp: NgSelectComponent;

private _opened: boolean = false;
 
  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  public countries = [];
  bounds = [];
  map;
  public defaultCountry;
  markers: MarkerMetaData[] = [];
  options = {
    layers: [tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")],
    zoomControl: false
  };

  constructor(
    private dataService: DataService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.getCountries();
    this.defaultCountry = ["FR"];
  }

  onMapReady(map) {
    // get a local reference to the map as we need it later
    this.map = map;
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
  }

  ngAfterViewInit(): void {
    this.addMarker("FR");
  }

  addMarker(country) {
    this.dataService.getMarkers(country).subscribe((res: any) => {
      for (const c of res) {
        // dynamically instantiate a HTMLMarkerComponent
        const factory = this.resolver.resolveComponentFactory(
          HTMLMarkerComponent
        );

        // we need to pass in the dependency injector
        const component = factory.create(this.injector);

        // wire up the @Input() or plain variables (doesn't have to be strictly an @Input())
        component.instance.data = c;

        // we need to manually trigger change detection on our in-memory component
        // s.t. its template syncs with the data we passed in
        component.changeDetectorRef.detectChanges();

        // pass in the HTML from our dynamic component
        const popupContent = component.location.nativeElement;

        const lat = c.coordinates["latitude"];
        const lon = c.coordinates["longitude"];

        const marker = L.marker([lat, lon]);

        // add popup functionality

        marker.bindPopup(popupContent).openPopup();
        marker.addTo(this.map);

        // add a metadata object into a local array which helps us
        // keep track of the instantiated markers for removing/disposing them later
        this.markers.push({
          name: c.city,
          markerInstance: marker,
          componentInstance: component
        });

        this.bounds.push([lat, lon]);
      }

      this.map.fitBounds(this.bounds);
    });
  }

  removeMarker() {
    for (const c of this.markers) {
      this.map.removeLayer(c.markerInstance);
      // destroy the component to avoid memory leaks
      //c.componentInstance.destroy();
    }
  }

  // simulate some change which needs
  // to trigger updates on our dynamic components
  mutateMarkerData() {
    // this provocates changes which the components on the markers have to re-render
    this.dataService.changeMarkerData();
  }

  getCountries(): void {
    this.dataService.getCountries().subscribe((data: any[]) => {
      this.countries = data;
    });
  }

  public refreshMap(event) {
    this.removeMarker();
    this.addMarker(event.code);
  }

  // This is a lifecycle method of an Angular component which gets invoked whenever for
  // our component change detection is triggered
  ngDoCheck() {
    // since our components are dynamic, we need to manually iterate over them and trigger
    // change detection on them.
    this.markers.forEach(entry => {
      entry.componentInstance.changeDetectorRef.detectChanges();
    });
  }

  OnOpen() {
    if (!this.isbeingSearched) {
      this.select1Comp.close();
    }
  }

  OnSearch() {
    this.isbeingSearched = true;
    this.select1Comp.open();
  }

  OnBlue() {
    this.isbeingSearched = false;
    this.select1Comp.close();
  }
}
