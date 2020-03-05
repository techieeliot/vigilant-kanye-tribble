const express = require('express')
const request = require('request')
const app = express()
const port = 3000
const KanyeURL = 'http://api.kanye.rest'
const getKanyeWrapper = (wisdom) => `<h1>${wisdom}</h1>`

const getKanyeQuoteCallback = (response) => (err, res, body) => {
    if(err) return console.log(err)
    response.send(getKanyeWrapper(body.quote))
}

const kanyeFetcher = (req, response) => {
    const KanyeCallback = getKanyeQuoteCallback(response)

    return request(KanyeURL, {json: true}, KanyeCallback)
}

app.get('/', kanyeFetcher)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))