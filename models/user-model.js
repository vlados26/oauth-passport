import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String
    },
    googleId: {
        type: String
    },
    thumbnail: {
        type: String
    }
});

module.exports = model('user', userSchema);