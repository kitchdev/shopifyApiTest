
const express = require('express')
const app = express()
const port = 3000

const { 
  listCustomersPaginate, 
  listAllOrdersPaginate,
  listCancelledOrders,
  listFufilledOrders
} = require('./route/shopifyService')


app.get('/listCustomers', listCustomersPaginate)

app.get('/listAllOrders', listAllOrdersPaginate)

app.get('listCancelledOrders', listCancelledOrders)

app.get('/listFufilledOrders', listFufilledOrders)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))