const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const userController = require("./user/userController");

//import models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
            // biblioteca de operadores



//Sessions
app.use(session({//cookie é uma referencia p/ a sessão no servidor
  secret: "hasuhshsgdgdfdfdfsgdfdfddsfd", cookie: { }
}))

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
app.use("/", userController);

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

/* sessoes */
app.get("/session", (req, res)=>{//escrever sessão
     req.session.treinamento = "Formação node js";
     req.session.ano = 2021;
});

app.post("/search", (req, res)=>{ //paginação
 
  const search = `%${req.body.search}`; // string de consulta
 

  Article.findAll({ where: { title: { [Op.like]: search } } })
  .then(articles => {
      if(articles == undefined){
        Article.findAll({ where: { body: { [Op.like]: search } } })
          .then(articles => {
              if(articles != undefined){
                Category.findAll().then(categories =>{
                  var result = null;
                  res.render("index",{result: result,articles: articles, categories: categories})
                });
              }else{
                console.log("aff");
                res.redirect("/");
              }
          });
      }else{
        Category.findAll().then(categories =>{
          var result = null;
          res.render("index",{result: result,articles: articles, categories: categories})
        });
      }

      
  });
  
});

// app.get("/read", (req, res) =>{//ler sessão

// });

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