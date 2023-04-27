require("dotenv").config()
const Person = require("./models/person")

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// request logger middleware
morgan.token("data", (req) => req.method === "POST"
  ? JSON.stringify(req.body) 
  : " "
)
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

// get data info
app.get("/info", (req, res) => Person
  .find({})
  .then(data => res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${new Date()}</p>
  `)
))

// get all persons
app.get("/api/persons", (req, res) => 
  Person
    .find({})
    .then(persons => res.status(200).json(persons))
)

// get one person
app.get("/api/persons/:id", (req, res, next) => 
  Person
    .findById(req.params.id)
    .then(person => person
      ? res.status(200).json(person)
      : res.status(404).end()
    )
    .catch(error => next(error))
)

// add a person
app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) return res.status(400).json({ 
    error: "content missing" 
  })

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(saved => res.status(200).json(saved))
})

// delete a person
app.delete("/api/persons/:id", (req, res, next) => Person
  .findByIdAndRemove(req.params.id)
  .then(deleted => res.status(204).end())
  .catch(error => next(error))
)

// change a person
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updated => res.status(200).json(updated))
    .catch(error => next(error))
})

// error middleware
const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  
  if (error.name === "CastError") return res.status(400).send({
    error: "malformatted id"
  })

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`))