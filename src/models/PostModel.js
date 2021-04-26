const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    owner: {type: String},
    avatar: {type: String},
    image: {type: String},
    desc: {type: String},
}, { 
    timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)