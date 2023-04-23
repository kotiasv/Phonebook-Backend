const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
let data = [
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
// request logger middleware
morgan.token("data", (req) => req.method === "POST"
  ? JSON.stringify(req.body) 
  : " "
)
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))
// get data info
app.get("/info", (req, res) => res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${new Date()}</p>
`))
// get all persons
app.get("/api/persons", (req, res) => res.status(200).json(data))
// get one person
app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = data.find(person => person.id === id)

    person
        ? res.status(200).json(person)
        : res.status(404).end()
})
// delete a person
app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    data = data.filter(person => person.id != id)

    res.status(204).end()
})
// add a person
app.post("/api/persons", (req, res) => {
    const body = req.body

    if (!body.name || !body.number) return res.status(400).json({
            error: "name or number is required"
    })

    if (data.find(person => person.name === body.name)) return res.status(400).json({
         error: "name must be unique" 
    })

    const person = {
        id: Math.floor(Math.random() * 1000000) + 1,
        ...body
    }
    data = data.concat(person)

    res.status(200).json(person)
})

const PORT = 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`))