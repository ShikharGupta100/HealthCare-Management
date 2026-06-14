// create class ApiError that extends Error
// constructor takes: statusCode, message
// call super(message)
// set this.statusCode = statusCode
// set this.success = false
// export ApiError

class ApiError extends Error {
    constructor (statusCode,message){
        super(message)
        this.statusCode = statusCode
        this.success = false
    }
}
module.exports = ApiError