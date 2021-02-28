const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshToken = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    key: {
        type: String,
    }

})

module.exports = mongoose.model('RefreshToken', RefreshToken);