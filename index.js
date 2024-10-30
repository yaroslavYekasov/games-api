const express = require('express');
const app = express();
const port = 8080;
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const games = [
  { id: 5, name: 'Witcher 3', price: 39.99 },
  { id: 2, name: 'Cyberpunk 2077', price: 59.99 },
  { id: 3, name: 'The Last of Us', price: 49.99 },
  { id: 4, name: 'God of War', price: 29.99 },
  { id: 5, name: 'Halo Infinite', price: 69.99 },
  { id: 6, name: 'Red Dead Redemption 2', price: 59.99 },
  { id: 7, name: 'Minecraft', price: 19.99 },
  { id: 8, name: 'Fortnite', price: 0.00 }
];

app.get('/games', (req, res) => {
  res.send(games);
});
app.get('/games/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); 
  const game = games.find(g => g.id === id);
  if (!game) {
      return res.status(404).send({ error: 'Game not found.' });
  }
  res.send(game);
});
app.post('/games/:name/:price', (req, res) => {
  const name = req.params.name;
  const price = req.params.price;

 if (!name || typeof parseInt(price) !== 'number') {
    return res.status(400).send({ error: 'Invalid game data. Name and price are required.' });
 } 
 games.forEach(game => {
  if (game.name == name){
    return res.status(409).send({ error: 'The game already exists'})
  }
 });
  const newGame = {
    id: games.length + 1,
    name,
    price
  };
  games.push(newGame);
  res.status(201).send(newGame);
});
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}/docs`);
});