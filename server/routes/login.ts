import { Router, Request, Response, NextFunction } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { secret, length, digest } from "../config";

var User = require('../models/usuario.model.js');

const loginRouter: Router = Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// Models

db.on('error', console.error.bind(console, 'error de conexión MongoDB:'));
db.once('open', function() {
    console.log('Conexión con MongoDB en login.ts en curso...');


// login method
loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {

        User.findOne({nick: request.body.nick},{password:1,salt:1},function (err, result) {
    if (err) { 
        response(err);
         }
    if (result) {
        var storedPassSalt = result;
    pbkdf2(request.body.password, storedPassSalt.salt, 10000, length, digest, (err: Error, hash: Buffer) => {
        if (err) {
            console.log(err);
        }
        // check if password is active
        if (hash.toString("hex") === storedPassSalt.password) {

            const token = sign({"nick": request.body.nick, permissions: []}, secret, { expiresIn: "7d" });
            response.status(200).json({"jwt": token});

        } else {
            response.status(401).json({message: "Credenciales incorrectas"});
        }

    });
    }else{
        response.status(401).json({"response":"credenciales incorrectas"})
    }
    });
});
});
export { loginRouter }
