import { Component, Input, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'html-marker',
  template: `
    <h3>{{ data.city }}</h3>
    <p>
      {{ data.value }}
    </p>
  `
})
export class HTMLMarkerComponent {
  @Input() data;
}