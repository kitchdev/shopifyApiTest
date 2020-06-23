
const express = require('express')
const app = express()
const port = 3000

const { listCustomersPaginate } = require('./route/shopifyService')

app.get('/listCustomers', listCustomersPaginate)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))