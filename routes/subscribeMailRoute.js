import express from 'express';
import subscribeMail from '../controllers/subcribeController';

const subscribe = express.Router();

subscribe.post('/', subscribeMail.subscribeMail);
// subscribe.get('/', subscribeMail.getPageEmail);

export default subscribe;
