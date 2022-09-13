const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const PORT = 8000;

MongoClient.connect('mongodb+srv://awnnlol:passwordz123@cluster0.go9pe2u.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')

    const db = client.db('todolist')
    const eventsCollection = db.collection('events')

    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(express.json())
    

    app.get('/', (req, res) => {
        
        db.collection('events').find().toArray()
        .then(results => {
            res.render('index.ejs', {events: results})
        })
        .catch(error => console.error(error))
    })

    app.post('/addEvent', (req, res) => {
        console.log(req.body)
        eventsCollection.insertOne({event: req.body.event, completed: 'false'})
        .then(result => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/markComplete', (req, res) => {
        eventsCollection.updateOne({event: req.body.itemFromJS}, {
            $set: {completed: 'true'}}, {
                sort: {_id: -1},
                upsert: false
            }).then(result => {
                console.log('Marked Complete')
                res.json('Marked Complete')
            })
            .catch(error => console.error(error))
    })

    app.put('/markUnComplete', (req, res) => {
        eventsCollection.updateOne({event: req.body.itemFromJS}, {
            $set: {completed: 'false'}}, {
                sort: {_id: -1},
                upsert: false
            }).then(result => {
                console.log('Marked UnComplete')
                res.json('Marked UnComplete')
            })
            .catch(error => console.error(error))
    })

    app.delete('/deleteItem', (request, response) => {
        eventsCollection.deleteOne({event: request.body.itemFromJS})
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))
    
    })

    app.listen(PORT, () => {
        console.log('Connected to ' + PORT)
    })

})




