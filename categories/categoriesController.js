const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");


router.get("/admin/categories/new/:id?", (req,res)=>{// Rota GET para direcionar tanto pra view de cadastrar quanto para view de atualizar
    var id = req.params.id;
    if(id){//update
        if(isNaN(id)){
            res.redirect("/admin/categories");
        }
        Category.findByPk(id).then(category=>{
            if(category != undefined){
                res.render("admin/categories/new",{category:category});//Utiliza a mesma view para cadastrar e atualizar
            }else{
                res.redirect("/admin/categories");
            }
        }).catch(erro =>{
             res.redirect("/admin/categories");
        });
    }else{//create
        var category = null;
        res.render("admin/categories/new",{category:category});
    }
});

router.post("/categories/save",(req,res)=>{//rota POST tanto para gravar no banco quando para atualizar
    var title = req.body.title;
    var id = req.body.id;
    if(id){//se existir id atualiza o registro
        if(title != undefined){
            Category.update({title: title, slug: slugify(title)},{
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories"); 
            })
        }else{
            res.redirect("/admin/categories/new/"+id);
        }
    }else{//se não existir id, grava um novo registro
        if(title != undefined){
            Category.create({
                title: title,
                slug: slugify(title)
            }).then(()=>{
                res.redirect("/admin/categories");
            })
        }else{
            res.redirect("/admin/categories/new");
        }
    }
   
});

router.get("/admin/categories",(req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/categories/index",{categories: categories});
    });
   
});

router.post("/categories/delete", (req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories");
            })

        }else{
            res.redirect("/admin/categories");
        }
    }else{
        res.redirect("/admin/categories");
    }
});

module.exports = router;