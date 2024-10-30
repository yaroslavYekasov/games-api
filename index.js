const app = require('express')();
const port = 8080;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}/docs`);
});
app.get('/games', (req, res) => {
  res.send([
    { name: 'Witcher 3' },
    { name: 'Cyberpunk 2077' }
  ]);
});