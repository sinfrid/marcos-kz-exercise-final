import { Component, Input, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'html-marker',
  template: `
    <h3>{{ data.name }}</h3>
    <p>
      {{ data.description }}
    </p>
  `
})
export class HTMLMarkerComponent {
  @Input() data;
}