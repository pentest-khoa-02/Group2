import express from 'express';

const shopCartRoute = express.Router();

shopCartRoute.get('/', (req, res) => {
  res.render('shop-cart', {
    errors: 'errors',
  });
});

export default shopCartRoute;