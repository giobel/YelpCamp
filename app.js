const express = require ('express');
const app = express();
const path = require('path')
const mongoose = require ('mongoose');
const Campground = require ('./models/campground')
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const {campgroundValidationSchema} = require('./schema')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () =>{
    console.log("Database connected");
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


const validateCampground = (req, res, next) =>{
    const {error} = campgroundValidationSchema.validate(req.body)
    
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}



app.get('/', (req, res) =>{
    //res.send("Hello from me")
    res.render('home.ejs')
})

app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find();
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new')
})



app.post('/campgrounds', validateCampground, catchAsync(async(req, res,next)=>{
    //if (!req.body.campground) throw new ExpressError("Invalid campground data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);    
}))

app.get('/campgrounds/:id', catchAsync(async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show',{campground});
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit',{campground});
}))

app.put('/campgrounds/:id/',validateCampground, catchAsync(async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


//HANDLING ERRORS

app.all('*',(req, res, next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
    const {status = 500} = err;
    if (!err.message) err.message = 'Something wrong';
    res.status(status).render('error', {err})
})

//

app.use((req, res)=>{
    res.status(404).send('Not found')
})



app.listen(3000, () =>{
    console.log('Listening on port 3000')
})