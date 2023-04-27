const mongoose = require("mongoose")
const url =
    `mongodb+srv://Admin:${process.argv[2]}@main.dnfe7jq.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose
    .connect(url)
    .then(() => console.log("Connected to MongoDB"))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model("Person", personSchema)

if (!process.argv[3] || !process.argv[4]) 
    Person
        .find({})
        .then(data => {
            console.log("phonebook:")
            data.forEach(person => console.log(`${person.name} ${person.number}`))
            console.log("Closing connection")
            mongoose.connection.close()
        })
else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    person
        .save()
        .then(res => {
            console.log(`Added ${res.name} number ${res.number} to phonebook`)
            console.log("Closing connection")
            mongoose.connection.close()
        })
}