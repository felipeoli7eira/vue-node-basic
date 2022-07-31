import express from 'express'
import { v4 as uuid } from 'uuid'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({origin: '*'}))

interface User {
    id: string,
    name: string,
    email: string
}

let database: Array<User> = [];

app.get('/users', (request, response) => {
    return response.status(200).json(database)
})

app.post('/users', (request, response) => {

    let { name, email } = request.body
    let id = uuid()
    let user = { id, name, email }

    database.push(user)

    return response.json(user)
})

app.put('/users', (request, response) => {
    let user = database.findIndex(user => user.email === request.body.email)

    if (user < 0) {
        return response.status(404).json({
            message: "usuario nao encontrado",
            status: "complete"
        })
    }

    database[ user ].name = request.body.name
    database[ user ].email = request.body.email

    return response.status(200).json(database[ user ])
})

app.delete('/users/:id', (request, response) => {
    let user = database.findIndex(user => user.id === request.params.id)

    if (user < 0) {
        return response.status(404).json({
            message: "usuario nao encontrado",
            status: "complete"
        })
    }

    database = database.filter(user => user.id !== request.params.id)

    return response.status(200).json(database)
})

app.listen('3333', () => console.log('Backend Started!'))