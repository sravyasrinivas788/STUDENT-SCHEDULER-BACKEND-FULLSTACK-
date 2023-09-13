const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type: String,
        required: true,
        minLength: 2,
        trim: true
    }
});

module.exports = mongoose.model('list', ListSchema);