import { Router, Request, Response, NextFunction } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import { sign } from "jsonwebtoken";
import { secret, length, digest } from "../config";

var User = require('../models/usuario.model.js');

const loginRouter: Router = Router();

const user = {
    hashedPassword: "6fb3a68cb5fe34d0c2c9fc3807c8fa9bc0e7dd10023065ea4233d40a2d6bb4a7e336a82f48bcb5a7cc95b8a590cf03a4a07615a226d09a89420a342584a" +
    "a28748336aa0feb7ac3a12200d13641c8f8e26398cfdaf268dd68746982bcf59415670655edf4e9ac30f6310bd2248cb9bc185db8059fe979294dd3611fdf28c2b731",
    salt: "OxDZYpi9BBJUZTTaC/yuuF3Y634YZ90KjpNa+Km4qGgZXGI6vhSWW0T91rharcQWIjG2uPZEPXiKGnSAQ73s352aom56AIYpYCfk7uNsd+7AzaQ6dxTnd9AzCCdIc/J" +
    "62JohpHPJ5eGHUJJy3PAgHYcfVzvBHnIQlTJCQdQAonQ=",
    username: "john"
};

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// Models

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connection to MongoDB in login.ts stablished...');


loginRouter.post("/signup", function (request: Request, response: Response, next: NextFunction) {
    if (!request.body.hasOwnProperty("password")) {
        let err = new Error("No password");
        return next(err);
    }

    const salt = randomBytes(128).toString("base64");

    pbkdf2(request.body.password, salt, 10000, length, digest, (err: Error, hash: Buffer) => {
        //var nombre="prueba";
        var pass= hash.toString("hex");
        //var salt= salt;
        var obj = new User({
            name:'name',lastnamep:"pat",lastnamem:"mat",
             password:pass,salt:salt,nick:"test6"
        });
        obj.save(function(err, obj) {
            if(err) return console.error(err);
            console.log("User inserted successfully: "obj);
            response.status(200).json(obj);
    });
});
});

// login method
loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {

    pbkdf2(request.body.password, user.salt, 10000, length, digest, (err: Error, hash: Buffer) => {
        if (err) {
            console.log(err);
        }

        // check if password is active
        if (hash.toString("hex") === user.hashedPassword) {

            const token = sign({"user": user.username, permissions: []}, secret, { expiresIn: "7d" });
            response.json({"jwt": token});

        } else {
            response.json({message: "Wrong password"});
        }

    });
});
});
export { loginRouter }
