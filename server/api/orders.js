const router = require('express').Router()
const {Order, OrderDetail, Product} = require('../db/models')
module.exports = router

// GET /api/orders
router.get('/', async (req, res, next) => {
  try {
    const orderList = await Order.findAll({
      include: ['billing', 'address', 'product']
    })
    res.json(orderList)
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: ['billing', 'address', 'product']
    })
    if (order) {
      res.json(order)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    next(err)
  }
})
