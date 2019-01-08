var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer(); //Restify server
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
})

//BOT Framework connector

// var connector = new builder.ConsoleConnector().listen(); //BRAIN of the BOT 
var connector = new builder.ChatConnector();//Bot Emulator
server.post('/api/messages', connector.listen()); //Connect the Chat connector and Restify

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hey there! I'm a vritual assistant. I can help you book a medical appointment with us. Please provide answers to the following questions.  %s", session.message.text);
    session.beginDialog('setAppointment');


});

bot.dialog('setAppointment', [(session, args, next) => {
    builder.Prompts.text(session, "Whats your name?");


}, (session, results) => {
    session.userData.name = results.response;
    builder.Prompts.number(session, "Great! Whats your age?");
}, (session, results) => {
    session.userData.age = results.response;
    builder.Prompts.choice(session, "Ok, Whats your gender?", ["Male", "Female"]);
}, (session, results) => {
    session.userData.gender = results.response.entity;
    builder.Prompts.time(session, "When would you like to have an appointment? You can say 'tomorrow 10 am or date and time in m/d/yyyy hh:mm'");
}, (session, results) => {
    session.userData.datetime = builder.EntityRecognizer.resolveTime([results.response]);

    var data = session.userData;
    session.send("Thank you for your time. I have booked an appointment for you at  " + data.datetime);
    session.send("Appointment Details: \nName:  " + data.name + "\nAge: " + data.age + "\nGender:  " + data.gender);
}



]);