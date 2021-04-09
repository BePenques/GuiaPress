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

  Article.findAll({
    order:[
      ['id','DESC']
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories =>{
      var result = null;
      res.render("index",{result: result,articles: articles, categories: categories})
    });
  });
})

app.get("/:slug", (req,res)=>{
  var slug = req.params.slug;
  Article.findOne({
    where:{
      slug : slug
    }
  }).then(article =>{
    if(article != undefined){
      Category.findAll().then(categories =>{
        res.render("article",{article: article, categories: categories})
      });
    }else{
      res.redirect("/");
    }
  }).catch( error => {
      res.redirect("/");
  })
})

app.get("/category/:slug", (req,res)=>{
  var slug = req.params.slug;
  Category.findOne({
    where:{
      slug: slug
    },
    include: [{model: Article}]//inner join c article
  }).then( category => {
    if(category != undefined){
      Category.findAll().then(categories =>{
        res.render("index",{articles: category.articles, categories: categories})
      });
      
    }else{
       res.redirect("/");
    }

  }).catch(err =>{
    res.redirect("/");
  })
})

app.listen(8080, ()=>{
    console.log("servidor esta rodando!");
})