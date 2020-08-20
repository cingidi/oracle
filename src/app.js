const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const app = express();

//Define paths for Express Config
const publicPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicPath));

app.get('',(req,res) => {
    res.render('index',{
        title: "Weather",
        name: 'Nikita'
    });
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: "About Me",
        name: "Sachi"
    });
});

app.get('/help', (req,res) => {
    res.render('help', {
        title: "Help",
        name: "Nikita",
        msg: "How can i help you?"
    });
});
// app.get('/',(req,res) => {
//     res.send("<h1>Hello Express</h1>");
// });

// app.get('/help', (req,res)=> {
//     res.send([{
//         name: 'Nikita',
//         age: 22
//     }]);
// });

// app.get('/about',(req,res) => {
//     res.send('<h1>About</h1>');
// });

app.get('/weather',(req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide address'
        });
    }
    const address = req.query.address;
    geocode(address, (error,{latitude,longitude,location}= {}) => {
        if(error) {
          return res.send({
              error
          });
        }
      
          forecast(latitude,longitude, (error, forecastData) => {
              if(error) {
                  return res.send({error});
              }
              res.send({
                  location,
                  Data: forecastData,
                  address
              });
          })
      });
});

app.get('/products', (req,res) => {
    if(!req.query.search) {
       return res.send({
            error: "You must provide search term"
        })
    }
    
    console.log(req.query);
    res.send({
        products: []
    });
});

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: "Nikita",
        errorText: "Help article not found"}
        );
});

app.get('*',(req,res) => {
    res.render('404', {
       title: '404',
       name: "Nikita", 
       errorText: "My 404 page"}
        );
});

app.listen(3000, () => {
    console.log("Listening..");
});