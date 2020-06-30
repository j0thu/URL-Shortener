if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Mongoose setup
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL,
    {    
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useNewUrlParser: true, 
        useUnifiedTopology:true
    });
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));


const ShortUrl = require('./models/shortUrl');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.get('/', async(req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls: shortUrls});
})

app.post('/shortUrls', async(req, res)=> {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
})

app.get('/:shortUrl', async(req, res)=> {
   const shortUrl =  await ShortUrl.findOne({short: req.params.shortUrl});
   if(shortUrl == null) return res.sendStatus(404);

   shortUrl.clicks++;
   shortUrl.save();

   res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 5000);    
