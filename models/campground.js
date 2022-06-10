const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    //there can be multiple reviews per campground -> 
    //create their own model and only store the object id 
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review' //model name
    }]
})

module.exports = mongoose.model('Campground', CampgroundSchema);