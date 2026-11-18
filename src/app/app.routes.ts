import { Routes } from '@angular/router';
import { BookList } from './book-list/book-list';
import { Stats } from './stats/stats';

export const routes: Routes = [
  { path: '', component: BookList },
  { path: 'stats', component: Stats },
];
