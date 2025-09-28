const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let users = [
    { id: 1, name: "Monica", budget: 500 },
    { id: 2, name: "Perla", budget: 300 },
    { id: 2, name: "Michelle", budget: 300 },
    { id: 2, name: "Sol", budget: 300 }
];

let locations = [
  { id: 1, name: "Statue of Liberty", votes: { yes: [], no: [] }, estCost: 25 },
  { id: 2, name: "Times Square", votes: { yes: [], no: [] }, estCost: 0 },
  { id: 3, name: "Empire State Building", votes: { yes: [], no: [] }, estCost: 44 },
  { id: 4, name: "Brooklyn Bridge", votes: { yes: [], no: [] }, estCost: 0 },
  { id: 5, name: "Broadway Theater District", votes: { yes: [], no: [] }, estCost: 150 },
  { id: 6, name: "Rockefeller Center", votes: { yes: [], no: [] }, estCost: 38 },
  { id: 7, name: "One World Observatory", votes: { yes: [], no: [] }, estCost: 40 },
  { id: 8, name: "Metropolitan Museum of Art", votes: { yes: [], no: [] }, estCost: 30 },
  { id: 9, name: "Museum of Modern Art (MoMA)", votes: { yes: [], no: [] }, estCost: 25 },
  { id: 10, name: "American Museum of Natural History", votes: { yes: [], no: [] }, estCost: 23 },
  { id: 11, name: "Chrysler Building", votes: { yes: [], no: [] }, estCost: 0 },
  { id: 12, name: "Flatiron Building", votes: { yes: [], no: [] }, estCost: 0 },
  { id: 13, name: "New York Public Library", votes: { yes: [], no: [] }, estCost: 0 },
  { id: 14, name: "Madison Square Garden", votes: { yes: [], no: [] }, estCost: 50 },
  { id: 15, name: "Coney Island", votes: { yes: [], no: [] }, estCost: 10 },
  { id: 16, name: "Yankee Stadium", votes: { yes: [], no: [] }, estCost: 35 },
  { id: 17, name: "Apollo Theater", votes: { yes: [], no: [] }, estCost: 30 },
  { id: 18, name: "Brooklyn Botanic Garden", votes: { yes: [], no: [] }, estCost: 18 }
];

function getMajorityYesPlaces(locations) {
  return locations.filter(
    location => location.votes.yes.length > location.votes.no.length
  );
}

app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get a single user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// Get all locations
app.get('/locations', (req, res) => {
    res.json(locations);
});

// Get all budgets (from users)
app.get('/budgets', (req, res) => {
    const budgets = users.map(u => ({ id: u.id, name: u.name, budget: u.budget }));
    res.json(budgets);
});

// Add a user
app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        budget: req.body.budget || 0
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Add a location
app.post('/locations', (req, res) => {
    const newLocation = {
        id: locations.length + 1,
        name: req.body.name
    };
    locations.push(newLocation);
    res.status(201).json(newLocation);
});

// POST /locations/:id/vote
// body: { userId: "some-unique-user", vote: "yes" or "no" }

app.post('/locations/:id/vote', (req, res) => {
  const { userId, vote } = req.body;
  const location = locations.find(l => l.id == req.params.id);
  if (!location) {
    return res.status(404).send('Location not found');
  }
  if (vote !== 'yes' && vote !== 'no') {
    return res.status(400).send('Vote must be "yes" or "no"');
  }

  // Remove user if already voted in the opposite category
  const opposite = vote === 'yes' ? 'no' : 'yes';
  if (location.votes[opposite].includes(userId)) {
    // Remove user from opposite
    location.votes[opposite] = location.votes[opposite].filter(u => u !== userId);
  }

  // Check if user already voted yes (to avoid duplicates in same list)
  if (!location.votes[vote].includes(userId)) {
    location.votes[vote].push(userId);
  }

  res.json({ 
    id: location.id,
    name: location.name,
    votes: location.votes
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id == req.params.id);
    if (index === -1) return res.status(404).send('User not found');
    const deletedUser = users.splice(index, 1);
    res.json(deletedUser[0]);
});

// Delete a location
app.delete('/locations/:id', (req, res) => {
    const index = locations.findIndex(l => l.id == req.params.id);
    if (index === -1) return res.status(404).send('Location not found');
    const deletedLocation = locations.splice(index, 1);
    res.json(deletedLocation[0]);
});

app.listen(3000, () => console.log('Server running on port 3000'));
