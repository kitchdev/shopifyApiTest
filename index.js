
const express = require('express')
const app = express()
const port = 3000

const { 
  listCustomersPaginate, 
  listAllOrdersPaginate,
  listCancelledOrders,
  listFufilledOrders,
  createPendingOrders,
  createOrderWebhook,
  listWebhooks,
  deleteWebhooks
} = require('./route/shopifyService')


app.get('/listCustomers', listCustomersPaginate)

app.get('/listAllOrders', listAllOrdersPaginate)

app.get('listCancelledOrders', listCancelledOrders)

app.get('/listFufilledOrders', listFufilledOrders)

app.get('/createPendingOrders', createPendingOrders)

app.get('/createorderwebhook', createOrderWebhook)

app.get('/listwebhooks', listWebhooks)

app.get('/deletewebhooks', deleteWebhooks)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))