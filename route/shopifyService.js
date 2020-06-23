const Shopify = require("shopify-api-node");
const sleep = require('util').promisify(setTimeout)
const Config = require('config')

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
        customers = await shopify.customer.search(params)
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
