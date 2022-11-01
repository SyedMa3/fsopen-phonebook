const { request, response, json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req,res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
  response.send(
    `
      <p>Phonebook has info for ${persons.length} people<p>
      <p>${new Date()}</p>
    `
    )
})

app.get('/api/persons/', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // console.log(id);
  const person = persons.find(person => person.id === id)

  if(!person)
  {
    response.status(404).end()
  } else
  {
    response.json(person)
  }
})

app.post('/api/persons', (request, response) => {
  const id = Math.random()*(1000000) + 10
  // console.log(request.body)
  if(!request.body.name){
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const person = {
    "id": id,
    "name": request.body.name,
    "number": request.body.number
  }

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})