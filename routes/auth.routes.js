const Router = require('express').Router();
const AuthController = require('../controllers/auth');

Router.get("/", AuthController.getUsuarioByIdName);
Router.post("/login", AuthController.login);
Router.post("/create", AuthController.createUser);
// Router.post ("/valida", AuthController.dfa);
// Router.get ("/vericarsms", AuthController.verificarSms);
Router.post("/logout", AuthController.logout);
Router.post("/refreshtoken", AuthController.refreshToken);
Router.put("/", AuthController.updateUsuario);
Router.put("/pw", AuthController.updatePassword);

module.exports = Router;