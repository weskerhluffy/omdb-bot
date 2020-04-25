'use strict'

import dotenv from "dotenv";
dotenv.config();
// XXX: https://medium.com/@etherealm/named-export-vs-default-export-in-es6-affb483a0910
// XXX: https://xperimentalhamid.com/how-do-i/fix-cannot-use-import-statement-outside-a-module/

import Hapi from "hapi";
import Boom from "@hapi/boom";
import movie from "./api/movie.js";
import poster from "./api/poster.js";

const server = Hapi.server({
  port: 3030,
  host: 'localhost'
})
const addAPIs = async () => {
  await server.register([movie, poster])
}
const init = async () => {
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
      return Boom.notFound('That path doesn\'t exist!')
    }
  })
  await addAPIs()
  await server.start()
  console.log('Server up on %s', server.info.uri)
}

/*
** The following complements DEP0018 by forcing uncaught promise rejections to crash the app.
** This can also be done viw mcollina's 'make-promises-safe' module.
*/
process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})
/*
** Setup is complete. Execute the server init() command.
*/
init()
