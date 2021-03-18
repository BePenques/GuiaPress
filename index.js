const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");

//import models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
//view engine
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body parser - formularios
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

//Database 
connection.authenticate()
          .then(()=>{
            console.log("Conexão feita com sucesso!")
          }).catch((error)=>{
            console.log(error);
          })

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req,res) =>{
    res.render("index");
})

app.listen(8080, ()=>{
    console.log("servidor esta rodando!");
})