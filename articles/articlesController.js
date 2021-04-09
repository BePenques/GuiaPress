const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles/new/:id?", (req,res)=>{// Rota GET para direcionar tanto pra view de cadastrar quanto para view de atualizar
    var id = req.params.id;
   
    if(id){//update
        if(isNaN(id)){
            res.redirect("/admin/articles");
        }
        Article.findByPk(id).then(article=>{
            if(article != undefined){
                Category.findAll().then(categories =>{
                res.render("admin/articles/new",{article: article, categories: categories});//Utiliza a mesma view para cadastrar e atualizar
            })
            }else{
                res.redirect("/admin/articles");
            }
        }).catch(erro =>{
             res.redirect("/admin/articles");
        });

    }else{//create
        var article = null;
        Category.findAll().then(categories =>{
            res.render("admin/articles/new",{article:article, categories: categories});
        })
    }
});

router.post("/articles/save",(req,res)=>{//rota POST tanto para gravar no banco quando para atualizar
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var id = req.body.id;
    if(id){//se existir id atualiza o registro
        if(title != undefined){
            Article.update({title: title, slug:slugify(title), body: body, categoryId: category},{
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/articles"); 
            }).catch(err=>{
                res.redirect("/");
            });
        }else{
            res.redirect("/admin/articles/new/"+id);
        }
    }else{//se não existir id, grava um novo registro
        if(title != undefined && body != undefined){
            Article.create({
                title: title,
                slug: slugify(title),
                body: body,
                categoryId: category
            }).then(()=>{
                res.redirect("/admin/articles");
            })
        }else{
            res.redirect("/admin/articles/new");
        }
     }
   
});

router.get("/admin/articles",(req,res)=>{
    Article.findAll({
        include: [{model: Category}]//join c/ category
    }).then(articles =>{
        res.render("admin/articles/index",{articles: articles});
    });
   
});

router.post("/articles/delete", (req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            })

        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
});

router.get("/articles/page/:num", (req,res)=>{
    // var page = req.params.num;
    var page = req.params.num;
     var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) -1) * 4;
    }
   
    //retorna a qtdade de artigos
    Article.findAndCountAll({
        limit: 4,
        offset: offset //retorna dados a partir de um valor 
    }).then(articles=>{

        var next;
        //verifica se tem outra pag p ser exibida
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles,

        }
       
        Category.findAll().then(categories =>{
            res.render("admin/articles/page",{result: result, categories: categories})
        });    
    })
});

module.exports = router;