const express = require('express')
const app = express()
const morgan = require('morgan')
const fs = require('node:fs')
const path = require('node:path')

const conn = require('./config/sequelize.config')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('tiny'))
app.use(morgan(`:remote-addr - :remote-user log-time:- [:date[web]] METHOD:- ":method :url HTTP/:http-version" :status RESPONSE-TIME:- :res[content-length] - :response-time ms`, { stream: accessLogStream }))

const PORT = process.env.PORT || 3000


app.get('/', (req, res) => {
    res.status(200).json({ msg: "Welcome to my app" })
})

app.get('/data', (req, res) => {
    res.status(200).json({
        id: 1,
        name: "Panchanan Deka",
        age: 25
    })
})

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT} 🚀🚀`)
})