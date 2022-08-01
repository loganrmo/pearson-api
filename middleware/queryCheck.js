const queryCheck = (req, res, next) => {
    if (!res.locals.queryValidity.state) {
        res.status(400);
        res.json({
            submit: 'Error: Bad Request',
            errorFields: `${res.locals.queryValidity.fields}`
        })
    } else {
        // console.log('Good request')
        next();
    }
}

module.exports = queryCheck;
