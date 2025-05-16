class customError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, customError);
        }
    }
}

module.exports=customError;