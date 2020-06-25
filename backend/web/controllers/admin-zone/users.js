const User = require('../../models/user');
const jwt = require("jsonwebtoken");


exports.getUsers= (req, res, next) => {
  let pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  let offset = 0;
  let limit = 0;
  console.log("");
  if (pageSize && currentPage) {
    offset = pageSize * (currentPage - 1);
    limit = pageSize;
  }
  let fetchedUsers;

  User.findAndCountAll(
    {
      attributes: ['email', 'name', 'date', 'role'], 
      order:[['date' , 'DESC']],
      limit: limit,
      offset: offset
    }
      ).then(data => {
        if (!data.rows) {
            const error = new Error('Não existem utilizadores na base de dados.');
            error.statusCode = 401;
            throw error;
          }
        fetchedUsers = data.rows;
        res.status(200).json({
            message: 'Obtenção de utilizadores teve sucesso',
            usersData: fetchedUsers,
            usersCount: data.count
        });
      }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
            err.message = 'Obtenção de utilizadores falhou no geral por erro no servidor.\n Por favor contactar o administrador.'
          }
          res.status(err.statusCode).send({
            usersData: [],
            usersCount: 0
          });
    });
}

exports.deleteUser =  (req, res, next) => {
  const userToDelete = req.query.usertodelete;
  console.log("user to deleete " , userToDelete);

    User.destroy({
        where: {
            email: userToDelete
        }
    })
    .then(()=>{
        let promise;
        promise = AlbunsRelations.destroy({where: {email: userToDelete} })
        return Promise.resolve(promise) 
    
    })
   .then(result => {
        res.status(200).json({
        message:"Utilizador Apagado com sucesso"
        });
    })
    .catch(err => {
        res.status(401).json({
            message: "Apagar Falhou."
        });
    })

}

exports.putUpdateUserRole =  (req, res, next) => {
  const userToUpdate = req.body.userEmail;
  const roleToUpdate = req.body.roleToUpdate;
  User.update(
      {role: roleToUpdate},
      {where: {email: userToUpdate}}
  ).then(()=>{
      res.status(200).json({
          message:"Papel do Utilizador Atualizado com sucesso"
      });
  }).catch(err => {
    res.status(401).json({
      message: "Atualiazção Falhou."
    });
  })
}