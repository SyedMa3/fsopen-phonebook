require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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



// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

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
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // console.log(id);
  Person.findById(id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const id = Math.random()*(1000000) + 10
  // console.log(request.body)
  if(!request.body.name){
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const person = new Person({
    "id": id,
    "name": request.body.name,
    "number": request.body.number
  })

  person.save().then(result => {
    response.json(result)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)
  // console.log(request.params);

  Person
  .findOneAndDelete({id: request.params.id})
  .then(result => {
    // response.json(result)
    response.status(204).end()
  })
  .catch(err => console.log(err))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})