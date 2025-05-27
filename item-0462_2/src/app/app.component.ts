import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DownloadComponent } from './download/download.component';

@Component({
  selector: 'app-root',
  imports: [DownloadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'item-0462_2';
}
