function notFound(req, res, next) {
    return res.status(404).json({
        status: 404,
        success: false,
        message: 'مسیر وجود ندارد'
    })
    // const fileNotFound = require('fs').readFileSync(path.join(__dirname, "404.html"), 'utf-8')
    // fileNotFound.replace('TITLE_ERROR', "مسیر یافت نشد").replace('MESSAGE_ERROR','نمیشه داداش')
    // return res.send(fileNotFound.replace('TITLE_ERROR', "مسیر یافت نشد").replace('MESSAGE_ERROR','نمیشه داداش'))
}

function expressErrorHandler(error, req, res, next) {
    const status = error?.status || 500
    const message = error?.message || "internalServer error"
    return res.status(status).json({
        status,
        success: false,
        message
    })
}

module.exports = {
    notFound,
    expressErrorHandler
}