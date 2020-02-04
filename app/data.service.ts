import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, map } from "rxjs/operators";
import { LatLngExpression} from 'leaflet';

export class Marker {
  id: number;
  name: String;
  description: String;
  position: LatLngExpression
}

export class Measurement {
    code: string;
    count: number;
    locations: number;
    cities: number;
    name: string;
}

@Injectable()
export class DataService {

constructor(private http: HttpClient) { }


private countryUrl = 'https://api.openaq.org/v1/countries';  // URL to web api
private measurementsUrl = 'https://api.openaq.org/v1/measurements?country=';  // URL to web api

  markers: Marker[] = [
    {
      id: 1,
      name: 'Marker name 1',
      description: 'descr 1',
      position: [ 46.879966, -121.726909 ]
    },
    {
      id: 2,
      name: 'Marker name 2',
      description: 'descr 2',
      position: [ 46.000966, -123.726909 ]
    }
  ];

  getMarkers(country): Observable<Measurement[]> {
    return this.http
        .get(this.measurementsUrl + country)
        .pipe(map(result=>result["results"]))
}

  getMarkerById(id) {
    return this.markers.filter((entry) => entry.id === id)[0];
  }

  changeMarkerData() {
    for(let marker of this.markers) {
      // just add a random number at the end
      marker.description = `Some random value ${Math.random() * 100}`;
    }
  }

  getCountries (){
  return this.http
  .get(this.countryUrl)
  .pipe(map(result=>result["results"]));
  }

}