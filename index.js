const express = require('express');
const helmet = require('helmet');

const initialize = require('./middleware/initialize');
const sanitize = require('./middleware/sanitize');
const validate = require('./middleware/validate');
const queryCheck = require('./middleware/queryCheck');
const queryBuilder = require('./middleware/queryBuilder');
const queryExecutor = require('./middleware/queryExecutor');

const app = express();
app.set('query parser', 'simple');  // Ensures parsing only to strings not objects
app.use(helmet());

app.use(initialize);
app.use(sanitize);
app.use(validate);
app.use(queryCheck);
app.use(queryBuilder);
app.use(queryExecutor);

app.get('/api/departures', (req, res) => {});
app.get('/api/arrivals', (req, res) => {});

app.get('*', (req, res) => {
    res.status(404)
    res.json({
        status: "Endpoint not found"
    });
});

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
