'use strict'
const router = require('express').Router(); // eslint-disable-line new-cap
const Cart = require('../../../db').model('Cart');
const User = require('../../../db').model('User');

router.get('/', (req, res, next) => {

    (function() {
        if (req.user) {
            return req.user.getCarts({ scope: 'itemsInCart' });
        } else if (req.session.CartId) {
            return Cart.findOne({
                where: {
                    id: req.session.CartId,
                    active: true
                },
                include: [{
                    association: Cart.Product
                }]
            });
        } else {
            return res.sendStatus(400);
        }
    }())
    .then(carts => {
            if (!carts) {
                return res.sendStatus(404);
            } else {
                return res.send(carts);
            }
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        Cart.create({ UserId: req.user.id })
            .then(() => {
                // This serves to refresh the user associations.
                return User.findOne({
                    where: {
                        id: req.user.id
                    },
                    include: [{ association: User.Cart }]
                })
            })
            .then(user => res.send(user.sanitize()))
            .catch(next);
    }
});

router.put('/:id', (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        Cart.update({ active: true }, { where: { id: req.params.id, UserId: req.user.id }, returning: true, individualHooks: true })
            .then(cart => {
                if (!cart[0]) {
                    return res.sendStatus(404);
                } else {
                    if (String(req.user.id) !== String(cart[1][0].UserId)) return res.sendStatus(401);
                    return res.send(cart[1][0]);
                }
            })
            .catch(next);
    }
});

router.delete('/:id', (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        Cart.destroy({ where: { id: req.params.id, UserId: req.user.id }, individualHooks: true })
            .then((cart) => {
                if (!cart) {
                    return res.sendStatus(400)
                } else {
                    return res.sendStatus(204);
                }
            })
            .catch(next);
    }
});

router.use((req, res, next) => {
    (function() {
        if (req.user) {
            return Cart.findOne({
                where: {
                    UserId: req.user.id,
                    active: true
                },
                include: [{
                    association: Cart.Product
                }]
            });
        } else if (req.session.CartId) {
            return Cart.findOne({
                where: {
                    id: req.session.CartId,
                    active: true
                },
                include: [{
                    association: Cart.Product
                }]
            });
        } else {
            return res.sendStatus(400);
        }
    }())
    .then(cart => {
            if (!cart) {
                return res.sendStatus(404);
            } else {
                req.cart = cart;
                next();
            }
        })
        .catch(next);
});

router.get('/active', (req, res, next) => res.send(req.cart));

router.post('/active/:id', (req, res, next) => {

    req.cart.addItem(req.params.id, { individualHooks: true })
        .then(() => res.sendStatus(200))
        .catch(next);
});

router.delete('/active/:id', (req, res, next) => {

    req.cart.removeItem(req.params.id)
        .then((item) => {
            if (item) {
                return res.sendStatus(204);
            } else {
                return res.sendStatus(404);
            }
        })
        .catch(next);
});

module.exports = router;
