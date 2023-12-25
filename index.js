const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggrwjrl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("TaskManagement").collection("tasks");

    app.post("/taskInfo", async (req, res) => {
      try {
        const fromData = req.body;
        console.log(req.body);
        const result = await taskCollection.insertOne(fromData);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/tasks", async (req, res) => {
      const email = req.query?.email;
      // || 'saikatsingha50@gmail.com'
      const query = {
        user_email: email,
      };

      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    // app.put("/tasksUpdate/:id", async (req, res) => {
    //   try {
    //     const taskId = req.params.id;
    //     console.log(taskId);
    //     const updatedTaskData = req.body;
    //     console.log(updatedTaskData);
    //     const filter = { _id: new ObjectId(taskId) };
    //     const updatedTask = {
    //       taskName: updatedTaskData.taskName,
    //       description : updatedTaskData.description,
    //       deadline:updatedTaskData.deadline,
    //       priority:updatedTaskData.priority,
    //       status: updatedTaskData.status
    //     };
    //     const updateOperation = {
    //       $set: updatedTask,
    //     };
    //     const result = await taskCollection.updateOne(filter, updateOperation);
    //     res.send(result);

    //     // // Find and update the task by its ID
    //     // const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

    //     // if (!updatedTask) {
    //     //   return res.status(404).json({ message: 'Task not found' });
    //     // }

    //     // res.json(updatedTask);
    //   } catch (error) {
    //     console.error("Error updating task:", error);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // });


    app.patch('/tasksUpdate/:id', async (req, res) => {
      const taskId = req.params.id;
      console.log(taskId);
      const updates = req.body;
      console.log(updates);
      const filter = { _id: new ObjectId(taskId) };
      const options = { upsert: true };
      // const updatedTaskData = {
      //   taskName: req.body.taskName,
      //   description: req.body.description,
      //   deadline: req.body.deadline,
      //   priority: req.body.priority,
      //   taskType: req.body.status,
      // };
      const updateOperation = {
        $set: updates,
      };
      try {
        
        
    
        // Find and update the task by its ID
        const result = await taskCollection.updateOne(filter, updateOperation,options);
        console.log(result);
        res.send(result);
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.delete("/tasksDelete/:id", async (req,res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("TaskManagement application is running");
});

app.listen(port, () => {
  console.log(`TaskManagement app listening on port ${port}`);
});
