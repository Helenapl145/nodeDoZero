/*
    CRIAÇÃO DE SERVIDOR SEM FRAMEWORK
const server = createServer((request,response) =>{
    response.write('hello world')

    return response.end()
})

server.listen(3333) 
*/

// CRIAÇÃO DO SERVIDOR COM FRAMEWORK

import { fastify } from 'fastify'
// import { DatabaseMamory } from './database-memory.js'
import { DatabasePostgres } from './databse-postgres.js'

const server = fastify()

const database = new DatabasePostgres()

// ROTAS

server.post('/videos', async (request, reply) => {
    const {title, description, duration} = request.body


    await database.create({
        title,
        description,
        duration
    })

 
    // status code mostra se a ação deu certo ou errado com base em um número de estato
    return reply.status(201).send
})

server.get('/videos', async (request) =>{
    const search = request.query.search
    const videos = await database.list(search)

    return videos
})


// Route Parameter - para pegar somente um item é necessário passar o id desse mesmo
server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id
    const {title, description, duration} = request.body

    await database.update(videoId, {
        title,
        description,
        duration,
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', async (request,reply) => {
    const videoId = request.params.id

    await database.delete(videoId)

    return reply.status(204).send()
})

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333, 
})