const express = require ('express');
const app = express();

const mongoose = require ('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;



const path = require('path')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) =>{
    //res.send("Hello from me")
    res.render('home.ejs')
})

app.listen(3000, () =>{
    console.log('Listening on port 3000')
})