const {green, red} = require('chalk')
const db = require('../db')
const {
  User,
  Address,
  Billing,
  Product,
  Order,
  OrderDetail
} = require('./models')
const axios = require('axios')

const users = [
  {
    name: 'Asim Samuel',
    email: 'asim@email.com',
    phoneNumber: '123-456-7890',
    password: '12345',
    privilege: 'Buyer'
  },
  {
    name: 'Samuel Asim',
    email: 'samuel@email.com',
    phoneNumber: '123-456-7890',
    password: '12345',
    privilege: 'Buyer'
  }
]

const addresses = [
  {
    street1: '12345 Asim Street',
    street2: 'Apt 102',
    city: 'Brooklyn',
    state: 'New York',
    country: 'USA',
    zipcode: '11234'
  }
]

const billings = [
  {
    cardNumber: '123123123123',
    securityCode: '123',
    name: 'Asim Samuel',
    expirationDate: '09/01/2021'
  }
]

const names = [
  'Fido',
  'Brody',
  'Deedee',
  'Chipper',
  'Buddy',
  'Buck',
  'Hank',
  'Cody',
  'Max',
  'Frank'
]
const products = []
const seed = async () => {
  try {
    await db.sync({force: true})
    const userList = await Promise.all(users.map(user => User.create(user)))
    const addressList = await Promise.all(
      addresses.map(address => Address.create(address))
    )
    const billingList = await Promise.all(
      billings.map(billing => Billing.create(billing))
    )
    const {data: {message: dogs}} = await axios.get(
      'https://dog.ceo/api/breed/eskimo/images'
    )

    for (let i = 0; i < 10; i++) {
      products.push({
        name: names[i],
        breed: 'Eskimo',
        description: 'A fiercely loyal companion.',
        quantity: 1,
        price: 300,
        picture: dogs[i]
      })
    }
    const productList = await Promise.all(
      products.map(product => Product.create(product))
    )
    const order = await Order.create({
      instruction: 'Please ring the doorbell when you are in front.',
      purchaseDate: '09/22/2020',
      expectedDeliveryDate: '09/30/2020',
      totalPrice: 1500
    })
    const closedOrder = await Order.create({
      status: 'Delivered',
      instruction: 'Please ring the doorbell when you are in front.',
      purchaseDate: '09/20/2020',
      expectedDeliveryDate: '09/22/2020',
      totalPrice: 1500
    })
    await closedOrder.setAddress(addressList[0])
    await closedOrder.setBilling(billingList[0])
    await userList[0].addOrder(order)
    await userList[1].addOrder(closedOrder)
    await Promise.all(
      productList.slice(5).map(product =>
        OrderDetail.create({
          orderId: 1,
          productId: product.id,
          quantity: 5
        })
      )
    )
    await Promise.all(
      productList.slice(0, 5).map(product =>
        OrderDetail.create({
          orderId: 2,
          productId: product.id,
          quantity: 2
        })
      )
    )
    // console.log(await order.getProducts())
    // await order.addProduct([productList[0]])

    // Associating users with address and billing
    await userList[0].addAddress(addressList[0])
    await userList[1].addAddress(addressList[0])
    await userList[0].addBilling(billingList[0])
    await userList[1].addBilling(billingList[0])
    await billingList[0].setAddress(addressList[0])
  } catch (error) {
    console.error(error)
  }
}

module.exports = seed
// If this module is being required from another module, then we just export the
// function, to be used as necessary. But it will run right away if the module
// is executed directly (e.g. `node seed.js` or `npm run seed`)
if (require.main === module) {
  seed()
    .then(() => {
      console.log(green('Seeding success!'))
      db.close()
    })
    .catch(err => {
      console.error(red('Oh noes! Something went wrong!'))
      console.error(err)
      db.close()
    })
}
