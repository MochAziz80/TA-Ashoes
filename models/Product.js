const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    price: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);