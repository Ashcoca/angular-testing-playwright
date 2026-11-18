import express from 'express';

const app = express();
const port = 3000;

// Fixed suggestion catalogue served to the app. Deliberately tiny — it exists
// so the app has a real HTTP dependency for the testing lesson.
const suggestions = [
  { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
  { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin' },
  { title: 'Project Hail Mary', author: 'Andy Weir' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss' },
];

app.get('/api/suggestions', (_req, res) => {
  res.json(suggestions);
});

app.listen(port, () => {
  console.log(`Suggestions API listening on http://localhost:${port}`);
});
