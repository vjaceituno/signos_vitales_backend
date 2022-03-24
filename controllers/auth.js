const passport = require("../utils/passport");
const moment = require("moment-timezone");
const User = require("../models/usuarios");

const passwordResetToken = require("../models/passwordResetToken")
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const mongoose = require("mongoose");
const randtoken = require("rand-token");
const path = require("path");
const fs = require("fs");
const Tokens = require('../models/tokens');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
// const fsPromises = fs.promises;
// const config = require("../config")
// const client = require ("twilio")(config.accountID, config.authToken)



const login = (req, res, next) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(403).json({ error: true, message: err });
      }

      if (!user) {
        return res.status(401).json(info);
      }

      if (user.auth && user.auth.token) {
        new Tokens({ token: user.auth.token, refreshToken: user.auth.refreshToken, user: user._id }).save();
      }
      user.auth = {
        ...user.auth,
        token: user.generateJwt(user),
        refreshToken: randtoken.uid(256),
        exp: moment()
          .add(5, "days")
          .toDate()
      };
      user
        .save()
        .then(savedUser => {
          const user_ = { ...savedUser.toJSON() };
          delete user_.hash;
          delete user_.salt;
          delete user_.password;

          res.json(user_);
        })
        .catch(err => {
          return res
            .status(403)
            .json({ error: true, message: err.message || err });
        });
    })(req, res, next);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

//DOBLE FACTOR DE AUTENTICACION
//funcion para realizar el envio de codigo de verificación a un numero del Celular
const dfa = (req , res, next) => {
  console.log('Hola es Prueba', req.body.celular);
  client
        .verify
        .services(config.serviceID)
        .verifications
        .create({
          to: `+${req.body.celular}`,   //req.query.celular,
           channel:'sms' //req.query.channel
        })
        .then ((data) => {
         res.status(200).send(data)

        })
      };
  

const verificarSms = (req, res) =>{
  //recibimos la verificacion del codigo
  console.log('Hola es Prueba', req.query.codigo);
  client
        .verify
        .services(config.serviceID)
        .verificationChecks
        .create({
          to: `+${req.query.celular}`,   //req.query.celular,
          code : req.query.codigo
          // channel: req.body.codigo
          
        })
        .then ((data)=> {
          res.status (200).send(data)
        })

};


// CREACION DE USUARIOS
const createUser = (req, res, next) => {
  try {
    const params = req.body;
    const user = new User(params);
    const token = user.generateJwt(user);
    const credentials = user.setPassword(user.password);
    user.auth = {
      token: token,
      refreshToken: randtoken.uid(256),
      exp: moment()
        .add(5, "days")
        .toDate()
    };
    user
      .save()
      .then(savedUser => {
        const user_ = { ...savedUser.toJSON() };
        delete user_.hash;
        delete user_.salt;
        delete user_.password;

        res.json(user_);
      })
      .catch(err => res.status(403).json({ err: err.toString() }));
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

// FUNCIONES SALIR
const logout = (req, res, next) => {
  try {
    const params = req.body;
    const user = req.payload && req.payload.user ? req.payload.user : undefined;

    User.findOne(
      { 'auth.refreshToken': params.refreshToken }
    ).exec()
    .then(user => {
      console.log('user', user);
      if(!user) {
        return Promise.resolve(true);
      }
        new Tokens({
          token: user.auth.token,
          refreshToken: user.auth.refreshToken,
          user: user._id
        }).save()
      return User.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(user._id) },
          { $set: { auth: {} } }
        ).exec();
      })
      .then((result) => {
        res.json({ logout: true });
      })
      .catch(err => {
        res.status(403).json({ logout: false, error: err.toString() });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

// RENOVAR EL TOKEN DE SESION
const refreshToken = (req, res, next) => {
  try {
    if (!req.body.refreshToken) {
      return res.status(403).json({ error: "refreshToken is required" });
    }
    const refreshToken = req.body.refreshToken;
    User.findOne({ "auth.refreshToken": refreshToken })
      .exec()
      .then(user => {
        if (!user) {
          throw Error("invalid refreshtoken");
        }
        const token = user.generateJwt(user);
        const refreshToken = randtoken.uid(256);
        user.auth = {
          token: token,
          refreshToken: refreshToken,
          exp: moment()
            .add(2, "days")
            .toDate()
        };
        return user.save();
      })
      .then(userWithNewToken => {
        const user_ = { ...userWithNewToken.toJSON() };
        delete user_.hash;
        delete user_.salt;
        delete user_.password;
        res.json(user_);
      })
      .catch(err => {
        res.status(401).json({ error: true, message: err.message || err });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

//modificar contraseña
const updatePassword = (req, res) => {
  try {
      const props = req.body;
     
      if (props._id) {
        props._id = mongoose.Types.ObjectId(props._id);
      }
      User.findOne({ _id: props._id })
        .select("+password +hash +salt")
        .exec()
        .then(user => {
          
            user.isValidPassword(props.passwordAct, (err, isMatch) => {
              if (err) {
                throw err;
              }
              if (isMatch) {
                
                const credentials = user.setPassword(props.password);      
                props.salt = credentials.salt;
                props.hash = credentials.hash;

                bcrypt.genSalt(10, (err, salt) => {
                  if (err) { return res; }
                  bcrypt.hash(credentials.password, salt, undefined, (err, hash) => {
                      if (err) { return res; }   
                                                                 
                      props.password = hash;  
          
                      User.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: false })
                      .exec()
                      .then((paciente) => {

                        const user_ = { ...paciente.toJSON() };
                          delete user_.hash;
                          delete user_.salt;
                          delete user_.password;
                          res.json(user_);
                                
                      })
                      .catch((err) => {
                          res.status(403).json(err.message);
                      });           
                  });
                });    
              
              }
              else {        
                //si la constraseña actual no es correcta       
                res.status(410).json({ message: "error.NoMathCurrentPassword" });              
              }      
            });  
        })
        .catch((err) => {            
          res.status(403).json(err.message);
        });     
               
  } catch (err) {
      res.status(500).json({ err: err.message });
  }
}

//obtener nombre datos de un doctor o usuario
const getUsuarioByIdName = (req, res) => {
  try {
      const props = req.query;
      if (props._id) {
          props._id = mongoose.Types.ObjectId(props._id);
      }
      if (props.fullName) {
        props.fullName = RegExp(props.fullName, "i");
      }
      User.find(props, 'fullName username roles enabled')
      .exec()
      .then((usuario) => {            
        res.json(usuario);        
      })  
      .catch((err) => {
          res.status(403).json(err.message);
      });

  } catch (err) {
      res.status(500).json({ err: err.message });
  }

}

const updateUsuario = (req, res) => {
  try {
      const props = req.body;
      console.log('pac mod', props);            
      User.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
      .exec()
      .then((paciente) => {
          res.json(paciente);
          console.log('pac mod', paciente);
      })
      .catch((err) => {
          res.status(403).json(err.message);
      });
  } catch (err) {
      res.status(500).json({ err: err.message });
  }
}

const getDoctores = (req, res) => {
  try {
    
    User.find( {  $and: [ { enabled: true }, { $or: [ { roles:'medico' }, { roles:'administrador' } ] }  ]  }, '_id fullName username roles enabled')
    // .where('roles').equals('medico')   
    .exec()
    .then((usuario) => {            
      res.json(usuario);        
    })  
    .catch((err) => {
        res.status(403).json(err.message);
    });

  } catch (err) {
      res.status(500).json({ err: err.message });
  }
}

const ResetPassword = async (req, res) => {
  try {
    console.log('res', req.body.email);
    if (!req.body.email) {
      return res
      .status(500)
      .json({ message: 'Se requiere correo electrónico' });
    }

    const user = await User.findOne({
      username: req.body.email
    });
    if (!user) {
      return res
      .status(409)
      .json({ message: 'El correo electrónico no existe' });
    }

    var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(function (err) {
      if (err) { 
        console.log('err', err);
        return res.status(500).send({ msg: err.message }); 
      }
      console.log('user ', user);
      passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
      res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
      var transporter = nodemailer.createTransport({
        // service: 'smtp.live.com',
        // service: 'Hotmail',
        service: 'Gmail',
        port: 465,
        secure: true,
        // port: 587,
        // requiresAuth: true,
        // domains: ["hotmail.com", "outlook.com"],
        // tls: {ciphers:'SSLv3'},
        // secure: true, // true for 465, false for other ports
        // auth: {
        //   user: 'vane.aceituno@hotmail.com',
        //   pass: 'Dell2014'
        // }
        auth: {
          user: 'vjaceituno@gmail.com',
          pass: 'domanar%42'
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'vjaceituno@gmail.com',
        subject: 'Signos Vitales - Restablezca su Contraseña',
        // html: ` 
        // <div> 
        // <img src="../public/upload/03skodu.png" style="height: 85px; width: 130px;" alt=""/>
        // <h3><i class="fa fa-lock fa-4x"></i></h3>
        // <i class="fas fa-vials"></i>
        // <p>Hola amigo</p> 
        // <p>Esto es una prueba del vídeo</p> 
        // <p>¿Cómo enviar correos eletrónicos con Nodemailer en NodeJS </p> 
        // </div> 
        // `
        text: 'Usted ha solicitado restablecimiento de la contraseña de su cuenta.\n\n' +
        'Haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso:\n\n' +
        'https://signosvitaleshn.com/res-reset/' + resettoken.resettoken + '\n\n' +
        'Este enlace tiene una duración de 24 horas.\n' +
        'Si no solicitó esta acción, ignore este correo electrónico y su contraseña permanecerá sin cambios.\n'       
      }
      transporter.sendMail(mailOptions, (err, info) => {
      })
    })
  } catch (err) {
    console.log('error us', err);
    res.status(500).json({ err: err.message });
  }
  
}

const ValidPasswordToken = async (req, res) => {
  if (!req.body.resettoken) {
    return res
    .status(500)
    .json({ message: 'Token is required' });
  }
  const user = await passwordResetToken.findOne({
    resettoken: req.body.resettoken
  });
  if (!user) {
    return res
    .status(409)
    .json({ message: 'Invalid URL' });
  }
  User.findOne({ _id: user._userId }).then(() => {
    res.status(200).json({ message: 'Token verified successfully.' });
  }).catch((err) => {
    console.log('err',err.message);
    return res.status(500).send({ msg: err.message });
  });
}

const NewPassword = async (req, res) => {
  const props = req.body;

  passwordResetToken.findOne({ resettoken: props.resettoken }, function (err, userToken, next) {
    if (!userToken) {
      return res
        .status(409)
        .json({ message: 'Token ha expirado' });
    }

    User.findOne({ _id: userToken._userId })
      .select("+password +hash +salt")
      .exec()
      .then(user => {
        console.log('user', user);
        const credentials = user.setPassword(props.newPassword);      
        props.salt = credentials.salt;
        props.hash = credentials.hash;       
        
        bcrypt.genSalt(10, (err, salt) => {
          if (err) { return res; }
          bcrypt.hash(props.newPassword, salt, undefined, (err, hash) => {
            if (err) { return res; }   
            
              props.password = hash;  
  
              User.findOneAndUpdate({_id: mongoose.Types.ObjectId(userToken._userId) }, { $set: props }, { new: false })
              .exec()
              .then((usuario) => {
                userToken.remove();
                      return res
                        .status(201)
                        .json({ message: 'Contraseña modificada correctamente.' });                  
              })
              .catch((err) => {
                return res
                .status(400)
                .json({ message: 'Error: La contraseña no pudo ser modificada.' });
              });           
          });
        });         
    })
    .catch((err) => {            
      res.status(403).json(err.message);
    });       
      
  })
}  

module.exports = {
  login,
  createUser,
  logout,
  refreshToken,
  dfa,
  verificarSms,
  updatePassword,
  getUsuarioByIdName,
  updateUsuario,
  getDoctores,
  ResetPassword,
  ValidPasswordToken,
  NewPassword
};
