
// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import { productRoutes } from './routes/product_route'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

dotenv.config();
console.log(process.env.DB_HOST);

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: '*'
})


// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.register(productRoutes)

// Run the server!
fastify.listen({ port: 5500 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
