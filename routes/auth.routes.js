const Router = require('express').Router();
const AuthController = require('../controllers/auth');

Router.get("/", AuthController.getUsuarioByIdName);
Router.get("/doctor", AuthController.getDoctores);
Router.post("/login", AuthController.login);
Router.post("/create", AuthController.createUser);
// Router.post ("/valida", AuthController.dfa);
// Router.get ("/vericarsms", AuthController.verificarSms);
Router.post("/logout", AuthController.logout);
Router.post("/refreshtoken", AuthController.refreshToken);
Router.put("/", AuthController.updateUsuario);
Router.put("/pw", AuthController.updatePassword);

Router.post('/req-reset-password', AuthController.ResetPassword);
Router.post('/new-password', AuthController.NewPassword);
Router.post('/valid-password-token', AuthController.ValidPasswordToken);

module.exports = Router;