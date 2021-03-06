const Shopify = require("shopify-api-node");
const sleep = require('util').promisify(setTimeout)
const Config = require('config')

const testOrder = require('../orders.json')

const config = {
  shopName: Config.get('shopifyApi.shopName'),
  accessToken: Config.get('shopifyApi.accessToken'),
  apiVersion: Config.get('shopifyApi.apiVersion'),
  autoLimit: Config.get('shopifyApi.autoLimit'),
  timeout: Config.get('shopifyApi.timeout'),
}


exports.listCustomersPaginate = async (req, res) => {
  req.setTimeout(600000)
  const shopify = new Shopify(config)
  console.log(shopify)
  const fields = [
    'id',
    'updated_at',
    'orders_count',
    'total_spent',
    'default_address'
  ].join()
  const limit = 250
  const customerCount = await shopify.customer.count()
  const totalPages = Math.ceil(customerCount / limit)
  const updated_at_min = "2019-07-02T18:06:31-05:00"
  let customersBatchs = []
  let page = 0
  let callLimit = 40
  let percentageComplete
  // const query = `updated_at:>"2019-07-02T18:06:31-05:00"`
  const query = `orders_count:>=0 order_date:>"2019-07-02T18:06:31-05:00"`
  try {
    await (async () => {
      let params = { limit, fields, query }
      console.time('import-customer')
      do {
        const customers = await shopify.customer.search(params)
        customersBatchs.push({ page: page + 1 }, ...customers)
        page++
        callLimit--
        percentageComplete = Math.floor((page / totalPages) * 100)
        params = customers.nextPageParameters
        console.log({ percentageComplete })
        if (callLimit === 0) {
          // console.log('sleeping for 10 seconds')
          // await sleep(12000)
          callLimit = 40
        }
      } while (params !== undefined)
    })()
    console.timeEnd('import-customer')
    console.log('Process complete')
    res.status(200).send(customersBatchs)
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.listAllOrdersPaginate = async (req, res) => {
  // req.setTimeout(600000)
  const shopify = new Shopify(config)
  console.log(shopify)
  try {
    const limit = 250
    const orderCount = await shopify.order.count()
    console.log(orderCount)
    const totalPages = Math.ceil(orderCount / limit)
    const updated_at_min = "2019-07-02T18:06:31-05:00"
    let orderBatchs = []
    let page = 0
    let callLimit = 40
    let percentageComplete
    // const query = `updated_at:>"2019-07-02T18:06:31-05:00"`
    // const query = `orders_count:>=0 order_date:>"2019-07-02T18:06:31-05:00"`
  
    await (async () => {
      const status = { status: 'any' }
      let params = { limit, created_at_min: '2018-04-25T16:15:47-04:00'}
      console.time('list-orders')
      do {
        const orders = await shopify.order.list(params, status)
        console.log(orders)
        orderBatchs.push({ page: page + 1 }, ...orders)
        page++
        callLimit--
        percentageComplete = Math.floor((page / totalPages) * 100)
        params = orders.nextPageParameters
        console.log({ percentageComplete })
        if (callLimit === 0) {
          // console.log('sleeping for 10 seconds')
          // await sleep(12000)
          callLimit = 40
        }
      } while (params !== undefined)
    })()
    console.timeEnd('list-orders')
    console.log('Process complete')
    res.status(200).send(orderBatchs)
  } catch (err) {
    console.error('error =>', err)
    res.status(400).send(err)
  }
}


exports.listCancelledOrders = async (req, res) => {
  req.setTimeout(600000)
  const shopify = new Shopify(config)
}

exports.listFufilledOrders = async (req, res) => {
  req.setTimeout(600000)
  const shopify = new Shopify(config)
}

exports.createPendingOrders = async (req, res) => {
  req.setTimeout(600000)
  const limit = 1000
  const shopify = new Shopify(config)
  let index = 0
  try {
    res.status(200).send({ success: true, message: 'created 1000 orders is in process'})
    console.log(testOrder)
    while (index < limit) {
      const shopRes = await shopify.order.create(testOrder)
      index++
      console.log(index)
      await sleep(15000)
    }
  } catch (err) {
    console.error('error =>', err)
    res.status(400).send({ success: false, message: err })
  }
}

exports.createOrderWebhook = async (req, res) => {
  req.setTimeout(600000)
  const shopify = new Shopify(config)
  try {
    const webhookRes = await shopify.webhook.create({
      topic: 'orders/create',
      address: 'https://us-central1-geometric-anagraph-dev.cloudfunctions.net/importPastOrders/recieveshopifyorder/',
      format: 'json',
      fields: ['id', 'created_at', 'customer', 'line_items']
    })
    res.status(200).send(webhookRes)
  } catch (err) {
    console.error('error => ', err)
    res.status(400).send({ success: false, message: err })
  }
}
exports.listWebhooks = async (req, res) => {
  req.setTimeout(600000)
  const shopify = new Shopify(config)
  try {
    const list = await shopify.webhook.list()
    res.status(200).send(list)
  } catch (err) {
    console.error(err)
    res.status(400).send({ success: false, message: err })
  }
}

exports.deleteWebhooks = async (req, res) => {
  req.setTimeout(600000)
  const shopify = new Shopify(config)
  try {
    const list = await shopify.webhook.list()
    const id = list[0].id
    const deleteRes = await shopify.webhook.delete(id)
    res.status(200).send(deleteRes)
  } catch (err) {
    console.error(err)
    res.status(400).send({ success: false, message: err })
  }
}