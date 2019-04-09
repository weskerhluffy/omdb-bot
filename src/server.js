'use strict'

require('dotenv').config()

const Hapi = require('hapi')
const Boom = require('@hapi/boom')

const server = Hapi.server({
  port: 3030,
  host: 'localhost'
})

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'The OMDB bot is up and running.'
  }
})

server.route({
  method: '*',
  path: '/{any*}',
  handler: (request, h) => {
    return Boom.notFound('That path or file does not exist.')
  }
})

exports.init = async () => {
  await server.register([require('./api/movie'), require('./api/poster')])
  await server.initialize()
  return server
}

exports.start = async () => {
  await server.register([require('./api/movie'), require('./api/poster')])
  await server.start()
  console.log('Server up on %s', server.info.uri)
}

/*
** The following complements DEP0018 by forcing uncaught promise rejections to crash the app.
** This can also be done via mcollina's 'make-promises-safe' module.
*/
process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})
