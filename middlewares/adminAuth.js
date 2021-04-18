function adminAuth(req, res, next){

    if(req.session.user != undefined) {
        next();
    }//existe a sessao no nav do usuario(esta logado)
    else{
        res.redirect("/login");
    }
}

module.exports = adminAuth;