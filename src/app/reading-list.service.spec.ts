import { ReadingListService } from './reading-list.service';

/*
 Unit tests for the service's logic.
 
 No TestBed, no HTTP mock, no router, no DOM, why not?
 The service is plain TypeScript with signals, so a bare instance is all
 the isolation the tests need.
 */
describe('ReadingListService', () => {
  let service: ReadingListService;

  beforeEach(() => {
    service = new ReadingListService();
  });

  it('adds a book with a generated id and starts unread', () => {
    const book = service.add('The Hobbit', 'J.R.R. Tolkien');

    expect(book).not.toBeNull();
    expect(book!.id).toBe(1);
    expect(book!.title).toBe('The Hobbit');
    expect(book!.author).toBe('J.R.R. Tolkien');
    expect(book!.read).toBe(false);
    expect(service.books().length).toBe(1);
  });

  it('ignores empty or whitespace-only titles', () => {
    expect(service.add('   ')).toBeNull();
    expect(service.add('')).toBeNull();
    expect(service.books().length).toBe(0);
  });

  it('toggleRead flips the read flag and updates stats', () => {
    const book = service.add('Dune')!;

    service.toggleRead(book.id);
    expect(service.books()[0].read).toBe(true);
    expect(service.stats().read).toBe(1);
    expect(service.stats().unread).toBe(0);

    service.toggleRead(book.id);
    expect(service.books()[0].read).toBe(false);
    expect(service.stats().read).toBe(0);
    expect(service.stats().unread).toBe(1);
  });

  it('reports percentComplete as 0 for an empty list', () => {
    const stats = service.stats();

    expect(stats.total).toBe(0);
    expect(stats.read).toBe(0);
    expect(stats.unread).toBe(0);
    expect(stats.percentComplete).toBe(0);
  });

  it('rounds percentComplete to the nearest whole percent', () => {
    // 1 of 3 read = 33.33% -> rounds to 33
    service.add('Dungeon Crawler Carl;');
    service.add('Carls Doomsday Scenario');
    service.add('The Dungeon Anarchist Cookbook');
    service.toggleRead(1);

    expect(service.stats().percentComplete).toBe(33);
  });
});
