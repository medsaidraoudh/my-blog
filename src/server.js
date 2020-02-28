import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import path from 'path';
const app=express();
app.use(express.static(path.join(__dirname,'/build')))
app.use(bodyParser.json())

mongoose.Promise=Promise

var dbUrl="mongodb+srv://medsaid:Buonno.Putendo.Ch2rido...@cluster0-kdpyc.mongodb.net/blog-db?retryWrites=true&w=majority"

const articlesCollection=mongoose.model('articles',{
    name:String,
    upvotes:Number,
    comments:[]
})
app.get('/api/articles/:name', async (req,res)=>{
    try{
    const articleName=req.params.name;
    const articleInfo= await articlesCollection.findOne(
        {name:articleName}
    )
    res.status(200).send(articleInfo);

    }catch(error){
        res.status(500).json({message: 'Error connecting to db ',error})
    }
})
app.post('/api/articles/:name/upvote',async (req,res)=>{
    try{
    const articleName=req.params.name;
        
    const articleInfo=await articlesCollection.findOne({name:articleName})
    // console.log(articleInfo);
    console.log(articleName);

    await articlesCollection.updateOne(
        {name:articleName},
        {
        $set:{ upvotes: articleInfo.upvotes+1  }
        });
        const updatedArticleInfo=await articlesCollection.findOne({name:articleName})
        // console.log(updatedArticleInfo); 
        res.status(200).send(updatedArticleInfo)
    }catch(error){
        res.status(200).send(error)
    }
    })

app.post('/api/articles/:name/add-comment',async (req,res)=>{
    const articleName=req.params.name;
    const articleInfo=await articlesCollection.findOne({name:articleName})
    const {username, text}=req.body;
    
    await articlesCollection.updateOne(
        {name:articleName},
        {
        $set:{ comments: articleInfo.comments.concat({username,text})  }
        });

        const updatedArticleInfo=await articlesCollection.findOne({name:articleName})
    res.status(200).send(updatedArticleInfo);
})


mongoose.connect(dbUrl,{useUnifiedTopology:true, useNewUrlParser: true},(error)=>{
    if(!error)
    console.log("mongo db connection");
    else console.log("error : ",error);
    
})


app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname+'/build/index.html'))
})
app.listen(8000,()=>console.log('listening on port 8000'));
