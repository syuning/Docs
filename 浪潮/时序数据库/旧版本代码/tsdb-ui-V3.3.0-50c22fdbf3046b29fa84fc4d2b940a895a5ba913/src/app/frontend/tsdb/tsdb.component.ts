import { Component } from '@angular/core';

@Component({
  selector: 'app-tsdb',
  templateUrl: './tsdb.component.html',
  styleUrls: ['./tsdb.component.css']
})
export class TsdbComponent {
  navToDocumentPage() {
    window.open('/document/tsdb/index.html', '_blank');
  }
}
