import { expect, test } from '@playwright/test';

/*
  End-to-end tests for the reading list. These drive the REAL running app
  (Angular dev server on 4200 + Express API stub on 3000) no mocks.
 */

test('shows the app header on the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('My Reading List');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Your books');
});

test('adds a book through the form and shows it in the list', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('e.g. The Hobbit').fill('The Hobbit');
  await page.getByPlaceholder('e.g. J.R.R. Tolkien').fill('J.R.R. Tolkien');
  await page.getByRole('button', { name: 'Add book' }).click();

  await expect(page.getByTestId('book-list')).toContainText('The Hobbit');
  await expect(page.getByTestId('list-stats')).toHaveText('0 of 1 read (0%)');
});

test('marking a book read updates the visible stats summary', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('e.g. The Hobbit').fill('Dune');
  await page.getByPlaceholder('e.g. J.R.R. Tolkien').fill('Frank Herbert');
  await page.getByRole('button', { name: 'Add book' }).click();

  await page.getByRole('button', { name: 'Mark read', exact: true }).click();

  await expect(page.getByTestId('list-stats')).toHaveText('1 of 1 read (100%)');
});

test('navigates to the stats page via the nav link and shows correct numbers', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('e.g. The Hobbit').fill('Dune');
  await page.getByRole('button', { name: 'Add book' }).click();
  await page.getByPlaceholder('e.g. The Hobbit').fill('Circe');
  await page.getByRole('button', { name: 'Add book' }).click();
  await page.getByRole('button', { name: 'Mark read', exact: true }).click();

  await page.getByRole('link', { name: 'Stats' }).click();

  await expect(page).toHaveURL(/\/stats$/);
  await expect(page.getByTestId('stat-total')).toHaveText('2');
  await expect(page.getByTestId('stat-read')).toHaveText('1');
  await expect(page.getByTestId('stat-unread')).toHaveText('0');
  await expect(page.getByTestId('stat-percent')).toHaveText('50%');
});
