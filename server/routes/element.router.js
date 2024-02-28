const express = require('express');

const elements = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Berylium'
];

const router = express.Router();

router.get('/', (req, res) => {
  res.send(elements);
});

router.post('/', (req, res) => {
  elements.push(req.body.name);
  res.sendStatus(201);
});


module.exports = router;
