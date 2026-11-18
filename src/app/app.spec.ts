import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(withFetch())],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App); // create an instance of App in the test env
    await fixture.whenStable(); // waits for angular to finish setup (render/load) before continuing
    const compiled = fixture.nativeElement as HTMLElement; // grabs DOM element so we can query as html
    expect(compiled.querySelector('h1')?.textContent).toContain('My Reading List');
  });
});
