import { Component, inject } from '@angular/core';
import { BookSuggestions } from '../book-suggestions/book-suggestions';
import { ReadingListService } from '../reading-list.service';

@Component({
  selector: 'app-book-list',
  imports: [BookSuggestions],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  protected readonly list = inject(ReadingListService);

  protected addBook(event: Event, titleInput: HTMLInputElement, authorInput: HTMLInputElement): void {
    event.preventDefault();
    this.list.add(titleInput.value, authorInput.value);
    titleInput.value = '';
    authorInput.value = '';
    titleInput.focus();
  }
}
