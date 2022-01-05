class ExpressError extends Error{
    constructor (message, status){
        super(); //call the error constructor
        this.message = message;
        this.status = status;
    }
}

module.exports = ExpressError;