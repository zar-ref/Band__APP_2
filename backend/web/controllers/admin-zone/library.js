const Library = require('../../models/library');

exports.getBooks  = (req, res, next) => {
    // let fetchedBooks = [];
    Library.findAll({attributes: ['bookId' , 'name' , 'author', 'description' , 'link'], order:[['bookId' , 'DESC']]})
        .then(books => {
            // console.log( "no find all", books);
            res.status(200).json({
                message: 'Obtenção de Livros teve sucesso!',
                books: books,
            })

        }).catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
                err.message = 'Obtenção de livros falhou no geral por erro no servidor.\n Por favor contactar o administrador.'
              }
              return res.status(err.statusCode).send({
                books: []
              });
        })
}

exports.postBook  = (req, res, next) => {
    const bookName = req.body.name;
    const bookAuthor = req.body.author;
    const bookDescription= req.body.description;
    const bookLink = req.body.link;

    Library.create({
        name: bookName,
        author: bookAuthor,
        description: bookDescription,
        link: bookLink
    }).then(response => {
        return res.status(200).json({
        message: "Livro Criado com Sucesso!"
        });
    }).catch(err => {
        res.status(500).send({
            message: 'Upload de livro falhou no geral.\n Por favor contactar o administrador.'
          });
    })


}

exports.deleteBook  = (req, res, next) => {
    console.log("aqi");
    const bookToDelete = req.query.bookToDelete;
    console.log(bookToDelete);
    Library.destroy({where: {bookId: bookToDelete}})
        .then(()=> {
            res.status(200).json({
                message:"Livro Apagado com sucesso"
            });
        }).catch( err => {
            res.status(401).json({
                message: "Apagar Falhou."
            });
        })
}


exports.updateBook  = (req, res, next) => {
    const bookId = req.body.bookId;
    const bookName = req.body.name;
    const bookAuthor = req.body.author;
    const bookDescription= req.body.description;
    const bookLink = req.body.link;
    console.log(bookId);
    Library.update(
        {name: bookName, author: bookAuthor, description: bookDescription, link: bookLink},
        {where: {bookId: bookId}}
        ).then(()=> {
            res.status(200).json({
                message:"Livro Atualizado com sucesso"
            });
        }).catch(err => {
            res.status(401).json({
              message: "Atualiazção Falhou."
            });
          })
}