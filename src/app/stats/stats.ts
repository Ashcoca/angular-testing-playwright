import { Component, inject } from '@angular/core';
import { ReadingListService } from '../reading-list.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  protected readonly list = inject(ReadingListService);
}
