"use strict";
// Require the framework and instantiate it
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ESM
const fastify_1 = __importDefault(require("fastify"));
const product_route_1 = require("./routes/product_route");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("@fastify/cors"));
dotenv_1.default.config();
console.log(process.env.DB_HOST);
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.register(cors_1.default, {
    origin: '*',
    methods: ["GET", "PUT", "POST", "OPTIONS", "DELETE"]
});
// Declare a route
fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' });
});
fastify.register(product_route_1.productRoutes);
// Run the server!
fastify.listen({ port: 5500 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
