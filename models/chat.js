const { default: mongoose } = require("mongoose");

const chatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    customerId:{
        type: String,
        default:''
    },
    subscription:{
        type: String,
        default:''
    }
});


module.exports = mongoose.model('Chat', chatSchema);