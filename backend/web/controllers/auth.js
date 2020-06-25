const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
  }
});




exports.postLogin = (req, res, next) => {
  console.log("AQUI");
    const userEmail = req.body.email;
    console.log(userEmail);
    let fetchedUser;
    User.findByPk(userEmail)
        .then(user => {
            if (!user) {
              const error = new Error('Autenticação Falhou no Email.\n Não temos esse Email registado.\n Por favor inscrever.');
              error.statusCode = 401;
              throw error;
            }
            if(user.role === "inactive"){
              const error = new Error('Autenticação Falhou no Email por estar Inativo.\n Por favor verificar o email de ativação');
              error.statusCode = 401;
              throw error;
            }
            fetchedUser = user;
            if(bcrypt.compareSync(req.body.password, user.password)){
              return true;
            }
            return false;     

        })
        .then(result => {
            if (!result) {
              const error = new Error('Autenticação Falhou na Password.');
              error.statusCode = 401;
              throw error;
            }
            const token = jwt.sign(
                { 
                    email: fetchedUser.email,
                    role: fetchedUser.role
                },
                process.env.JWT_KEY,
                { expiresIn: "1w" }
              );
              res.status(200).json({
                email: fetchedUser.email ,
                role: fetchedUser.role,
                name: fetchedUser.name ,
                _token: token, 
                _tokenExpirationDate: 1000 * 3600 * 24 * 7             
              });
        })
        .catch(err => {
          if(!err.statusCode){
            err.statusCode = 500;
            err.message = 'Autenticação falhou no geral por erro no servidor.\n Por favor contactar o administrador.'
          }
          res.status(err.statusCode).send({
            message: err.message
          });
        });
}

exports.postSignUp = (req, res, next) => {
  console.log("request", req.body);
  const newUserEmail = req.body.email;
  const newUserPassword = req.body.password;
  const newUserName = req.body.name
  // console.log(process.env.EMAIL, process.env.PASSWORD);
  let newHashPassword = bcrypt.hashSync(newUserPassword, 10);
  User.findByPk(newUserEmail)
    .then(user => {
      if(user){
        const error = new Error('O utilizador já se inscreveu.');
        error.statusCode = 401;
        throw error;
      }
      
      User.create({
        email: newUserEmail,
        name: newUserName,
        password: newHashPassword,
        date: new Date(),
        role: "inactive"
      });
      const emailToken = jwt.sign(
        { email: newUserEmail },
        process.env.JWT_KEY,
        { expiresIn: "1w" }
      );
      const emailConfirmationURL = `http://localhost:4200/confirmation/${emailToken}`;

      const mailOptions = {
        from: process.env.EMAIL, 
        to: newUserEmail,
        subject: 'Confirmação do Email - BAND_APP',
        html: `Por favor carregar no link seguinte para confirmar a inscrição<br><br>
        <a href="${emailConfirmationURL}">${emailConfirmationURL}</a>
        `
      };

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          const error = new Error('O email não foi enviado.');
          error.statusCode = 401;
          throw error;
        }
        res.status(200).json({
          message: "Inscrição concluida com sucesso."
        });
      });
    })
    .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
        err.message = 'Autenticação falhou no geral por erro no servidor.\n Por favor contactar o administrador.'
      }
      res.status(err.statusCode).send({
        message: err.message
      });
    })

}

exports.putConfirmation = (req, res, next) => {
  const emailToken = req.body.emailToken;  
  let userToConfirm; 
  try {
    userToConfirm= jwt.verify(emailToken,  process.env.JWT_KEY) 
  } 
  catch (err){
    const error = new Error('Link de confirmação inválido');
    error.statusCode = 401;
    return res.status(error.statusCode).send({
      message: error.message
    });        
  } 
  User.findByPk(userToConfirm.email) 
    .then(user => {
       console.log("esstou aqui");
      if(!user){
        const error = new Error('Confirmação Falhou no Email.\n Não temos esse Email registado. Por favor inscrever.');
        error.statusCode = 401;
        throw error;
      }
      if(user.role !== 'inactive'){
        const error = new Error('O utilizador já confirmou a inscrição.');
        error.statusCode = 401;
        throw error;
      }
      User.update(
        {role: "active"},
        {where: {email: userToConfirm.email}} )
        .then(()=>{
          res.status(200).json({
            message: "Confirmação concluida com sucesso."
        });
      });      
    }).catch(err => {
      console.log("no erro");
      if(!err.statusCode){
        err.statusCode = 500;
        err.message = 'Confirmação falhou no geral por erro no servidor.\n Por favor contactar o administrador.'
      }
      res.status(err.statusCode).send({
        message: err.message
      });
    })
};
