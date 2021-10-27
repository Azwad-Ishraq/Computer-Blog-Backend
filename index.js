const express = require('express')
const {MongoClient} = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

// password: lvEVyASExCJCDnYq




const uri = "mongodb+srv://first-mongo-app:lvEVyASExCJCDnYq@cluster0.axy7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {


    try {


      await client.connect();

      const database = client.db("computerBlog");

      const collection = database.collection("blogs");
      

    //   POST API
      app.post('/blogs', async (req,res)=>{
        const newBlog = req.body;
        const result = await collection.insertOne(newBlog);
        console.log('got new user',req.body)
        console.log('added user', result)
          res.json(result)
      })

      // GET API
      app.get('/blogs',async (req,res)=>{
        
        const page = req.query.page;
        const size = parseInt(req.query.size)
        const cursosr = collection.find({})
        const count = await cursosr.count()
        let blogs;
        if(page){
          blogs = await cursosr.skip(page*size).limit(size).toArray();
        }else{
        const blogs = await cursosr.toArray()

        }
        res.send({
          blogs,
          count
        })
      })

      //GET SINGLE BLOG 
      app.get('/blogs/:id', async (req,res)=>{
        const id = req.params.id;
        console.log('getting blog',id)
        const query = {_id: ObjectId(id)}
        const blog = await collection.findOne(query)
        res.json(blog)
      })

      // DELETE API
      app.delete('/blogs/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await collection.deleteOne(query)
        res.json(result)
      })

      // UPDATE API
      app.put('/blogs/:id', async (req,res)=>{
        const id = req.params.id;
        const updatedBlog = req.body;
        const filter = {_id: ObjectId(id)}
        const options = {upsert: true}
        const updateDoc = {
          $set:{
            heading: updatedBlog.heading,
            img: updatedBlog.img,
            des: updatedBlog.des
          }
        }
        const result = await collection.updateOne(filter,updateDoc,options)
        console.log('updating blog',req)
        res.json(result)
      })
        




    } 
    finally {
      // await client.close();
    }
  }




  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running CRUD Server')
    
})

app.listen(port,()=>{
    console.log('running server from port:',port)
})













