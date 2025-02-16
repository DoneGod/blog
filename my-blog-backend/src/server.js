import express from 'express';
import {db, connectToDb} from './db.js';
//import { MongoClient } from 'mongodb'

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async( req, res) => {
    const { name } = req.params;

    const article = await db.collection('articles').findOne({name});

    if (article){
        res.json(article); 
    }else{
        res.sendStatus(404);
    }

    //not res.send(article) because we are sending json just make sure that the correct headers are send

});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
   
    await db.collection('articles').updateOne({name}, {
        $inc: { upvotes: 1},
    });
    const article = await db.collection('articles').findOne({name});
    
    if (article){
       //res.send(`The ${name} article now has ${article.upvotes} upvotes!!`);
       res.json(article);
    }else {
        res.send('that article does not exist');
    }

});

app.post('/api/articles/:name/comments', async (req, res) => {
    const {name } = req.params;
    const { postedBy, text } = req.body;
    
    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text} },

    });
    const article = await db.collection('articles').findOne({name});

    if (article){
        res.json(article);
    }else{
        res.send('that article does not exist');
    }

    


});
connectToDb(() => {
    console.log('Successfully connected to database!')
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');

    });

})
