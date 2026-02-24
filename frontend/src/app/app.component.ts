import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="app-header">
      <h1>Vectera Coding Test</h1>
      <nav><a routerLink="/meetings">Meetings list</a></nav>
    </header>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent { }
