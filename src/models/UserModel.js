const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, require: true},
    password: {type: String},
    email: {type: String},
    name: {type: String},
    googleId: {type: String},
    role: {type: String},
    facultyName: {type: String},
    categories: {type: String},
    fcId: {type: String},
})

module.exports = mongoose.model('User', UserSchema)