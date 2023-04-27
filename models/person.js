const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const url = process.env.DB
mongoose
    .connect(url)
    .then(res => console.log("connected to DB"))
    .catch(error => console.log("error:", error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (value) => {
                const splited = value.split("-")
                const count = splited.length == 2

                // /^\d+$/ - checking for only numbers
                const firstPart = 
                    /^\d+$/.test(splited[0]) &&
                    (splited[0].length >= 2 && splited[0].length <= 3)

                const secondPart = /^\d+$/.test(splited[1])
                
                return count && firstPart && secondPart
            },
            message: "invalid phone number"
        },
        required: true
    },
})
personSchema.set("toJSON", {
    transform: (document, object) => {
        object.id = object._id.toString()
        delete object._id
        delete object.__v
    }
})
module.exports = mongoose.model("Person", personSchema)