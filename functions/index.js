'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

//to make it work you need gmail account
const gmailEmail = "REPLACE ME - BUT DON'T COMMIT!";
const gmailPassword = "REPLACE ME - BUT DON'T COMMIT!";

admin.initializeApp();

//creating function for sending emails
var goMail = function ({message,name,mail,subject}) {


//transporter is a way to send your emails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        },
        tls: {
            rejectUnauthorized: false
        }
        
    });

    // setup email data with unicode symbols
    //this is how your email are going to look like
    let final = name+" posílá zprávu, odpověz na email "+mail+". Obsah zprávy: "+message;
    const mailOptions = {
        from: gmailEmail, // sender address
        to: 'fleetesk@gmail.com, info@fleete.sk', // list of receivers
        subject: subject, // Subject line
        text: final, // plain text body
        html: final // html body
    };

    //this is callback function to return status to firebase console
    const getDeliveryStatus = function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    };

    //call of this function send an email, and return status
    transporter.sendMail(mailOptions, getDeliveryStatus);
};

//.onDataAdded is watches for changes in database
exports.onDataAdded = functions.database.ref('/emails/{sessionId}').onCreate(function (snap, context) {

    //here we catch a new data, added to firebase database, it stored in a snap variable
    const createdData = snap.val();

    //here we send new data using function for sending emails
    goMail(createdData);
});
