// COMP 3612
// Assignment 3
// Alex Tang
// December 8th, 2022
// server.js

const fs = require('fs');
const path = require('path');
const express = require('express');

//Artists API
const jsonPathArt = path.join(__dirname, 'data','artists.json');
const jsonDataArt = fs.readFileSync(jsonPathArt, 'utf8');
const artists = JSON.parse(jsonDataArt);

//Galleries API
const jsonPathGallery = path.join(__dirname, 'data','galleries.json');
const jsonDataGallery = fs.readFileSync(jsonPathGallery, 'utf8');
const galleries = JSON.parse(jsonDataGallery);

//Paintings API
const jsonPathPaint = path.join(__dirname, 'data','paintings-nested.json');
const jsonDataPaint = fs.readFileSync(jsonPathPaint, 'utf8');
const paintings = JSON.parse(jsonDataPaint);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//Get api/painting/.../id routes
app.get('/api/paintings', (req,resp) => { resp.json(paintings) } );

app.get('/api/painting/:paintingID', (req,resp) => {
    const paintingToFind = req.params.paintingID;
    const matches = paintings.filter(obj => paintingToFind == obj.paintingID);
    resp.json(checkData(matches));

} );

app.get('/api/painting/gallery/:galleryID', (req,resp) => {
    const paintingToFind = req.params.galleryID;
    const matches = paintings.filter(obj => paintingToFind == obj.gallery.galleryID);
    resp.json(checkData(matches));
} );

app.get('/api/painting/artist/:artistID', (req,resp) => {
    const paintingToFind = req.params.artistID;
    const matches = paintings.filter(obj => paintingToFind == obj.artist.artistID);
    resp.json(checkData(matches));
} );



//Get api/painting/... routes
app.get('/api/painting/year/:min/:max', (req,resp) => {
    const min = req.params.min;
    const max = req.params.max;
    const matches = paintings.filter(obj => (min <= obj.yearOfWork) && (max >= obj.yearOfWork));
    resp.json(checkData(matches));
} );

app.get('/api/painting/title/:substring', (req,resp) => {
    const substring = req.params.substring.toLowerCase();
    const matches = paintings.filter( (obj) => obj.title.toLowerCase().includes(substring) );
    resp.json(checkData(matches));
});

app.get('/api/painting/color/:name', (req,resp) => {          //Did I do this one right????
    const paintingToFind = req.params.name.toUpperCase();
    const matches = paintings.filter(obj => {
        for(col of obj.details.annotation.dominantColors){
            if (paintingToFind === col.name.toUpperCase() ){
                return obj;
            }
        }
    });
    resp.json(checkData(matches));
} );



//Get api/artists/... routes
app.get('/api/artists', (req,resp) => { resp.json(artists) } );

app.get('/api/artists/:Nationality', (req,resp) => {
    const artistToFind = req.params.Nationality.toUpperCase();
    const matches = artists.filter(obj => artistToFind === obj.Nationality.toUpperCase());
    resp.json(checkData(matches));
} );



//Get api/galleries/... routes
app.get('/api/galleries', (req,resp) => { resp.json(galleries) } );

app.get('/api/galleries/:GalleryCountry', (req,resp) => {
    const galleryToFind = req.params.GalleryCountry.toUpperCase();
    const matches = galleries.filter(obj => galleryToFind === obj.GalleryCountry.toUpperCase());
    resp.json(checkData(matches));
} );


function checkData(matches){
    if (matches.length == 0){
        return "The requested data is not found.";
    } else {
        return matches;
    }
}


//used this for Glitch default
const listener = app.listen(process.env.PORT, () => {
    console.log("App listening on port " + listener.address().port);
});

// let port = 8080;
// app.listen(port, () => {
//     console.log("Server running at port= " + port);
// });
