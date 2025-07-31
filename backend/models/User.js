const mongoose = require('mongoose'); //importing mongoose

const userSchema = new mongoose.Schema({ //creating schema i.e. blueprint 
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },

    password : {
        type : String,
        required : true
    },

    firstName : {
        type : String,
        required : true,
        trim : true
    },

    lastName : {
        type : String,
        required : true,
        trim : true
    }
},
    {
        timestamps : true,
        toJSON : {
            virtuals : true,
            transform : function (doc, ret)
            {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
            }
        }
});

module.exports = mongoose.model('User',userSchema);