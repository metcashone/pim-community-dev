const { readFileSync } = require('fs')
const express = require('express');
const process = require('process');
const app = express();
const dashboard = readFileSync('./tests/front/mock/responses/html/dashboard.html', 'utf-8');

// Server static assets
app.use(express.static(`${process.cwd()}/web/test_dist`))
app.use('/js', express.static(`${process.cwd()}/web/js`))
app.use('/css', express.static(`${process.cwd()}/web/css`))
app.use('/bundles', express.static(`${process.cwd()}/web/bundles`))

app.use('/rest/security', (req, res) => res.json(require('./responses/rest_security.json')))
app.use('/localization/format/date', (req, res) => res.json(require('./responses/date_format.json')))
app.use('/rest/user', (req, res) => res.json(require('./responses/user.json')))
app.use('/dashboard', (req, res) => res.send(dashboard))


app.listen(4000, () => console.log('Starting mock server'));
