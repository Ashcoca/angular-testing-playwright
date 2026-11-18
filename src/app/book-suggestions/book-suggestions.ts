import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadingListService } from '../reading-list.service';

interface BookSuggestion {
  title: string;
  author: string;
}

/*
 The HTTP boundary of the lesson: this component talks to a real backend
 (the Express stub on port 3000). Unit tests do NOT cover this — it is
 exercised end to end by Playwright instead.
 */
@Component({
  selector: 'app-book-suggestions',
  templateUrl: './book-suggestions.html',
  styleUrl: './book-suggestions.css',
})

export class BookSuggestions {
  private readonly http = inject(HttpClient);
  private readonly list = inject(ReadingListService);

  protected readonly suggestions = signal<BookSuggestion[]>([]);
  protected readonly state = signal<'loading' | 'ready' | 'error'>('loading');

  constructor() {
    this.http.get<BookSuggestion[]>('/api/suggestions').subscribe({
      next: (suggestions) => {
        this.suggestions.set(suggestions);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }

  protected addSuggestion(suggestion: BookSuggestion): void {
    this.list.add(suggestion.title, suggestion.author);
    this.suggestions.update((current) => current.filter((s) => s !== suggestion));
  }
}
