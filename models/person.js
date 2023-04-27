const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const url = process.env.DB
mongoose
    .connect(url)
    .then(res => console.log("connected to DB"))
    .catch(error => console.log("error:", error.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
personSchema.set("toJSON", {
    transform: (document, object) => {
        object.id = object._id.toString()
        delete object._id
        delete object.__v
    }
})
module.exports = mongoose.model("Person", personSchema)