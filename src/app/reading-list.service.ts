import { Injectable, computed, signal } from '@angular/core';

export interface Book {
  id: number;
  title: string;
  author: string;
  read: boolean;
}

export interface ReadingStats {
  total: number;
  read: number;
  unread: number;
  percentComplete: number;
}

/*
 In-memory store for the reading list.
 No HttpClient, Router or DOM access, that isolation is the point of 
 the unit-test lesson: these tests need no TestBed mocks.
 */
@Injectable({ providedIn: 'root' })
export class ReadingListService {
  private readonly _books = signal<Book[]>([]);
  private nextId = 1;

  // Read-only view of the books, for components to render. 
  readonly books = this._books.asReadonly();

  // Computed reading stats, derived from the book list. 
  readonly stats = computed<ReadingStats>(() => {
    const books = this._books();
    const total = books.length;
    const read = books.filter((book) => book.read).length;
    return {
      total,
      read,
      unread: total - read,
      percentComplete: total === 0 ? 0 : Math.round((read / total) * 100),
    };
  });

  /*
    Adds a book and returns it. Empty or whitespace-only titles are ignored
    (returns null instead of adding a junk entry).
   */
  add(title: string, author = ''): Book | null {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return null;
    }
    const book: Book = {
      id: this.nextId++,
      title: trimmedTitle,
      author: author.trim(),
      read: false,
    };
    this._books.update((books) => [...books, book]);
    return book;
  }

  // Removes the book with the given id, if present. 
  remove(id: number): void {
    this._books.update((books) => books.filter((book) => book.id !== id));
  }

  // Flips the read status of the book with the given id, if present. 
  toggleRead(id: number): void {
    this._books.update((books) =>
      books.map((book) => (book.id === id ? { ...book, read: !book.read } : book)),
    );
  }
}
