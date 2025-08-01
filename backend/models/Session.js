const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : true
    },

    tags : {
        type : [String],
        default : []
    },

    jsonFileUrl : {
        type : String,
        required : true,
    },

    isPublic : {
        type : Boolean,
        required : true
    },

    email : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Session',sessionSchema);