const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const NotificationSchema = new Schema({
    
    owner: {type: String},
    ownerId: {type: String},
    title: {type: String},
    categories: {type: String},
    briefText: {type: String},
    content: {type: String},
}, { 
   
    timestamps: true
})

module.exports = mongoose.model('Notification', NotificationSchema)