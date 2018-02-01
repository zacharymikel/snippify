'use strict';

let Response = {
    status: "",
    messages: [],
    errors: [],
    object: {}
};


function send(status, messages, errors, object, res) {

    let m = messages;
    if(!messages || messages === undefined) {
        m = "";
    }
    else if(messages.constructor !== Array) {
        m = [messages];
    }

    let e = errors;
    if(!errors || errors === undefined) {
        e = "";
    }
    else if(errors.constructor !== Array) {
        e = [errors];
    }

    res.status(status).json({
        "messages": m,
        "errors": e,
        "object": object
    });
}



module.exports = Response;
module.exports.send = send;