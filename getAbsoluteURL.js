function getAbsoluteURL(req) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

exports.getAbsoluteURL = getAbsoluteURL;
