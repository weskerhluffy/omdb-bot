'use strict'

import Wreck from "@hapi/wreck";
import Joi from "@hapi/joi";

let posterCall = async (api, id) => {
  const { req, res, payload } = await Wreck.get(`http://img.omdbapi.com/?apikey=${api}&i=${id}`)
  return payload
}

const plugin = {
  name: 'poster',
  version: '0.1.0',
  register: (server, options) => {
    server.route({
      method: ['GET', 'PUT', 'POST'],
      path: '/api/poster/{id?}',
      config: {
        validate: {
          params: {
            id: Joi.string().min(9).max(10).required()
          }
        }
      },
      handler: async (request, h) => {
        let findPoster
        try {
          findPoster = await posterCall(process.env.API_KEY, request.params.id)
        } catch (err) {
          console.error(err)
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

export default plugin;


