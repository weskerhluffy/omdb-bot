'use strict'

import Wreck from "@hapi/wreck";
import Joi from "@hapi/joi";
import {posterCall} from "./poster.js";

let movieCall = async (key, title) => {
  const { req, res, payload } = await Wreck.get(`http://www.omdbapi.com/?apikey=${key}&t=${title}`)
  return payload
}

const plugin = {
  name: 'movie',
  version: '0.1.0',
  register: (server, options) => {
    server.route({
      method: ['GET', 'PUT', 'POST'],
      path: '/api/movie/{title?}',
      config: {
        validate: {
          params: {
            title: Joi.string().required()
          }
        }
      },
      handler: async (request, h) => {
        let findMovieStr;
        try {
          findMovieStr = await movieCall(process.env.API_KEY, request.params.title)
        } catch (err) {
          console.error(err)
        }
        let findMovie=JSON.parse(findMovieStr);
        console.log(`HEAGTMP imdb name ${findMovie}`);
        console.log(`HEAGTMP imdb name ${findMovie.Type}`);
        console.log(`HEAGTMP imdb idd ${findMovie.imdbID}`);
        let poster=await posterCall(process.env.API_KEY, findMovie.imdbID);
//        return h.response(findMovie).type('application/json')
        return h.response(poster).type('image/jpeg')
      }
    })
  }
}

//module.exports.default = plugin;
export default plugin;
