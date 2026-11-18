# Reading List Testing Demo & Student Exercises

Objectives:

1. **Generated unit tests are not trustworthy by default.** The repo ships with a
   deliberately stale spec that fails under `ng test` (Vitest). Finding and fixing it
   is the opening demo.
2. **Unit-test a service's own logic in isolation** — no HTTP, no DOM, no router.
   `ReadingListService` is a pure signal store precisely so those tests need no mocks.
3. **Playwright drives the real running app** — the Angular dev server (port 4200) plus
   an Express API stub (port 3000). This is the priority focus of the lesson.

## Requirements

- **Node.js 22.22+** 
- Run `npm install`
- Run `npx playwright install chromium`

## Command cheat-sheet

| Command | What it does |
|---|---|
| `npm start` | Angular dev server on http://localhost:4200 (proxies `/api` to port 3000) |
| `npm run serve:api` | Express stub serving `GET /api/suggestions` on port 3000 |
| `npm test` / `ng test` | Unit tests via Vitest (`@angular/build:unit-test` builder) |
| `npm run e2e` / `npx playwright test` | Playwright E2E, its `webServer` config starts **both** servers for you |


> Fun Stuff:
> Use Playwright UI Mode. Run npx playwright test --ui to open an interactive dashboard with a live browser preview and time-travel debugging
---

## Exercises

Work through these in order. Each exercise's acceptance criterion is the test suite.

**[Vitest Docs for reference](https://vitest.dev/guide/)**

### Exercise 1: Fix the stale spec

Run `npm test`. One test fails. Read the failure message, decide whether the app or the test is wrong, and fix the **test**.

**Acceptance criteria**
- `npm test` is fully green (7 tests).
- You did not change `app.ts` or `app.html` to make it pass.
- You can say *why* the test was failing, in one sentence.

### Exercise 2: Unit-test `remove()`

`remove(id)` has no tests. Add them to `src/app/reading-list.service.spec.ts`.

**Acceptance criteria**
- A test proving a removed book disappears from `books()` and from `stats().total`.
- A test proving `remove()` with an unknown id leaves the list unchanged.
- Tests follow the existing style: a fresh service per test, no `TestBed`.

### Exercise 3: Unit-test the `add()` edge cases

Decide and pin down the behaviour for tricky input.

**Acceptance criteria**
- Titles with leading/trailing whitespace are stored trimmed.
- An empty author is stored as `''`.
- Two books added with the same title both exist (ids differ) — document that
  duplicates are allowed.

### Exercise 4: Unit-test the stats edge cases

**Acceptance criteria**
- A test that `unread = total - read` for a mixed list.
- A test that `percentComplete` is `100` when every book is read.
- A test that `percentComplete` returns to `0` when a single book is toggled back to
  unread (empty `read` set, non-empty list).

### Exercise 5: Extend the Playwright suite

Add tests to `e2e/reading-list.spec.ts`.

**Acceptance criteria**
- A mark-read **toggle** test: mark read, assert the summary; mark unread, assert it
  goes back.
- A remove-book test: add a book, remove it, assert the empty-state message
  ("No books yet…") is visible.
- A deep-link test: `page.goto('/stats')` directly (no nav click) and assert the stats
  table renders with zeroed numbers.
- All tests pass with `npx playwright test`.

### Exercise 6 (harder): Test the suggestions section with route interception

The suggestions section fetches `/api/suggestions`. Use Playwright's
`page.route()` to intercept that call instead of relying on the Express stub.

**Acceptance criteria**
- A test that stubs `/api/suggestions` with a mock array, asserts the mocked books are
  rendered, clicks Add, and asserts the book lands in the reading list.
- A test that fulfils the route with a 500 and asserts the app shows the error state
  ("Could not load suggestions…") instead of crashing.
- You can explain why this HTTP behaviour belongs in Playwright, not in the service's
  unit tests.

---

## Solutions
.

.

.

. NO CHEATING!

.

.

**Exercise 1.** The CLI-generated spec expected the scaffold header. Fix:

```ts
expect(compiled.querySelector('h1')?.textContent).toContain('My Reading List');
```

**Exercise 2.**

```ts
it('removes a book and updates stats', () => {
  service.add('Dune');
  service.remove(1);
  expect(service.books().length).toBe(0);
  expect(service.stats().total).toBe(0);
});

it('ignores removal of an unknown id', () => {
  service.add('Dune');
  service.remove(999);
  expect(service.books().length).toBe(1);
});
```

**Exercise 3.**

```ts
it('trims titles and authors', () => {
  const book = service.add('  Dune  ', '  Frank Herbert ');
  expect(book!.title).toBe('Dune');
  expect(book!.author).toBe('Frank Herbert');
});

it('allows duplicate titles with distinct ids', () => {
  const a = service.add('Dune');
  const b = service.add('Dune');
  expect(a!.id).not.toBe(b!.id);
  expect(service.books().length).toBe(2);
});
```

**Exercise 4.**

```ts
it('computes unread as total minus read', () => {
  service.add('A'); service.add('B'); service.add('C');
  service.toggleRead(1);
  expect(service.stats().unread).toBe(2);
});

it('reports 100% when everything is read', () => {
  service.add('A'); service.toggleRead(1);
  expect(service.stats().percentComplete).toBe(100);
});

it('returns to 0% when the last read book is toggled back', () => {
  service.add('A'); service.toggleRead(1); service.toggleRead(1);
  expect(service.stats().percentComplete).toBe(0);
});
```

**Exercise 5.**

```ts
test('toggles a book between read and unread', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('e.g. The Hobbit').fill('Dune');
  await page.getByRole('button', { name: 'Add book' }).click();

  await page.getByRole('button', { name: 'Mark read', exact: true }).click();
  await expect(page.getByTestId('list-stats')).toHaveText('1 of 1 read (100%)');

  await page.getByRole('button', { name: 'Mark unread', exact: true }).click();
  await expect(page.getByTestId('list-stats')).toHaveText('0 of 1 read (0%)');
});

test('removes a book and shows the empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('e.g. The Hobbit').fill('Dune');
  await page.getByRole('button', { name: 'Add book' }).click();

  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByText('No books yet — add your first one above.')).toBeVisible();
});

test('deep-links directly to the stats page', async ({ page }) => {
  await page.goto('/stats');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Reading stats');
  await expect(page.getByTestId('stat-total')).toHaveText('0');
  await expect(page.getByTestId('stat-percent')).toHaveText('0%');
});
```

**Exercise 6.**

```ts
test('shows mocked suggestions via route interception', async ({ page }) => {
  await page.route('**/api/suggestions', (route) =>
    route.fulfill({ json: [{ title: 'Mocked Book', author: 'Nobody' }] }),
  );
  await page.goto('/');

  await expect(page.getByText('Mocked Book')).toBeVisible();
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByTestId('book-list')).toContainText('Mocked Book');
});

test('shows the error state when the API fails', async ({ page }) => {
  await page.route('**/api/suggestions', (route) => route.fulfill({ status: 500 }));
  await page.goto('/');

  await expect(page.getByText('Could not load suggestions')).toBeVisible();
});
```
