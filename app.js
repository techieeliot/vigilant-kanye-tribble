const express = require('express')
const request = require('request')
const mysql = require('mysql')
const app = express()
const port = 3000
const KanyeURL = 'http://api.kanye.rest'
let currentQuote = ''
app.use(express.urlencoded());
const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'kanye'
})
con.connect(err => console.log(err))


const getKanyeWrapper = (wisdom) => `
<h1>${wisdom}</h1>
<button onClick="addWisdom()">
Add
</button>
<button onClick="resetWisdom()">Get A New Quote</button>
<script>function addWisdom(){ fetch('/add') };function resetWisdom(){fetch('${KanyeURL}').then((response) => {
    return response.json()}).then((data) => {document.querySelector('h1').innerHTML = data.quote})}</script>
`

const getKanyeQuoteCallback = (response) => (err, res, body) => {
    if (err) return console.log(err)
    currentQuote = body.quote
    response.send(getKanyeWrapper(body.quote))
}

const kanyeFetcher = (req, response) => {
    const KanyeCallback = getKanyeQuoteCallback(response)
    
    return request(KanyeURL, { json: true }, KanyeCallback)
}

const addQuote = (quote) => {
    const queryString = `insert into quotes(quote,created_at) values("${quote}", now());`
    con.query(queryString, (err, results, fields) => {
        if (err) console.log(err)
    })
}

const getBest = (req, res) => {
    con.query('select * from quotes where deleted_at is null order by created_at desc;', (err, results, fields) => {
        if (err) console.log(err)
        res.send(`<h1>${results[0].quote}</h1>`)
    })
}
const createUser = (req, res) => {
    if (req.body.password !== req.body.confirm) {
        res.send(`<script>alert('Passwords must match!');\r\nlocation.replace('/sign-up');</script>`);
        return;
    }
    con.query(`INSERT INTO users (profile_name, password, email, created_at) VALUES ("${req.body.username}", "${req.body.password}", "${req.body.email}", now())`, function(error, results, fields) {
        if (error) {
            res.status(400).send(`${JSON.stringify(error)}.`);
            return;
        };
        if (results) res.redirect('/');
    })
}
/*
    post req to send data to the server
    db lookup on the username
    if username doesn't exist handle
        return to the login to throw 'Please try again'
    if username exists
    query the db and compare ... select from table where username=''
    pull the password and compare the user password
    if false, then return to the login 'Please try again'
    if true, then redirect to the add screen

*/  

const authUser = (req, res) => {
    con.query(`select profile_name from users where profile_name=${req.body.username}`, function(error, results, fields){
        if(error) {
            res.status(400).send(`${JSON.stringify(error)}`)
            return;
        } 

        if(!results) {
            console.log('no results');
        }
    })
    

}
app.get('/', (req, res) => { res.sendFile(__dirname + '/views/index.html') })

app.get('/quote', kanyeFetcher)

app.get('/add', (req, res) => {
    addQuote(currentQuote)
    res.sendStatus(200)
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html')
})

app.get('/assets/login.css', (req, res) => {
    res.sendFile(__dirname + '/assets/login.css')
})

app.get('/best', getBest)

app.get('/sign-up', (req, res) => { res.sendFile(__dirname + '/views/sign-up.html') })
app.get('/assets/style.css', (req, res) => { res.sendFile(__dirname + '/assets/style.css') })
app.post('/sign-up', createUser)

app.get('*', function(req, res) {
    res.status(404).send('<h1>Nope</h1>');
<<<<<<< HEAD
  });


app.post('/login-submit', authUser)
=======
});
>>>>>>> 14d2f635f7a37698f201fe1084aebd72a822158c
app.listen(port, () => console.log(`Example app listening on port ${port}!`))