import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  date: string = '03/12/1987';

  getDate(date: string) {
    this.date = date;
  }
}
