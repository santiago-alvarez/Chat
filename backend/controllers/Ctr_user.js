const pg = require('./../db/db');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
/*Nodemailer*/
const Nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config;

let transport = Nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
}));

const controller = {
    /*Registro de usuario*/
    email: async (req, res) => {
        try {
            const { email, caso, code} = req.body;
            let htmlFile = path.join(path.dirname(__dirname), 'src', 'email');
            if (caso) {
                htmlFile = path.join(htmlFile, 'start.html');
            } else {
                htmlFile = path.join(htmlFile, 'delete.html');
            }
            fs.readFile(htmlFile, 'utf8' ,(err, data) =>{
                if (err){
                    res.json({status:false, err:err, message: "file-system"});
                }else{
                    let html = data.replace('$replaceHere$', code);
                    const mailOptions = {
                        from: "Web Page",
                        to: email,
                        subject: "Código de verificación",
                        html: html
                    }
                    transport.sendMail(mailOptions, (err, info) =>{
                        if(err){
                            res.json({status:false, err:err, message: 'nodemailer send mail'});
                            console.log(err);
                        }else{
                            res.json({status:true, info});
                        }
                    });
                }
            })
        } catch (err) {
            res.json({ status: false, err: err, message: "try-catch"});
            console.log(err);
        }
    },
    get_correo: async (req, res) => {
        try {
            const { correo } = req.params;
            let conection = await pg.connect();
            await conection.query(`SELECT CASE WHEN EXISTS(
            SELECT correo FROM usuarios WHERE correo= $1
        ) THEN true ELSE false END as result;`, [correo])
                .then((data) => {
                    conection.release();
                    res.json({ status: true, result: data.rows[0].result });
                })
                .catch((err) => {
                    res.json({ status: false, err: err, message:"PostgreSQL connection"});
                    console.log(err);
                });
        } catch (err) {
            res.json({ status: false, err: err, message:"Try-catch"});
            console.log(err);
        }
    },
    insert: async (req,res) =>{
       try{
            const {correo,nombre,apellido, fecha_nacimiento, contraseña} = req.body;
            const random = Math.round(Math.random() * 6, 5);
            const cry = await bcrypt.hash(contraseña, random);
            let conection = await pg.connect();
            await conection.query('INSERT INTO usuarios (correo, nombre, apellido, fecha_nacimiento, edad, contraseña ) VALUES ($1, $2, $3, DATE($4),extract(year from age(DATE($4))),$5) RETURNING *;' ,[correo, nombre,apellido, fecha_nacimiento, cry])
            .then((data) =>{
                conection.release();
                const token = jwt.sign(data.rows[0], process.env.JWT_PASSWORD);
                res.json({status:true, token:token});
            })
            .catch((err) =>{
                res.json({status:false,  message: "PostgreSQL connection", err:err});
                console.log(err);
            });
       } catch(err){
           res.json({status:false, message: "Try-catch", err:err});
           console.log(err);
       }
    }
}
module.exports = controller;