const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const {ObjectId  } = require('mongodb');
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');
app.set( 'ejs');
// Set the views directory explicitly if it's not in the default location
//app.set('views', __dirname );



mongourl="mongodb+srv://v599568:vaibhav1934@cluster0.7vzfh84.mongodb.net/?retryWrites=true&w=majority"
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(bodyParser.json());

const client = new MongoClient(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });
async function databsecreation() {
    try {
        console.log("okkkkkkkkkkkkkkkkk")
        // Connect to the MongoDB cluster
        await client.connect();
        const dbName = "Material";
        console.log("okkkkkkkkkkkkkkkkk")
        const dbList = await client.db().admin().listDatabases();
        const dbExists = dbList.databases.some(db => db.name === dbName);
        console.log("okkkkkkkkkkkkkkkkk")
        // Establish a connection to the database
        if (dbExists) {
            console.log(`Database "${dbName}" already exists.`);
        } else {
            // Create the database
            await client.db(dbName).createCollection('testCollection'); // Create a dummy collection
            console.log(`Database "${dbName}" created successfully.`);
        }

        const collectionName = "material";

        // Get reference to the database and collection
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Check if the collection already exists
        const collectionExists = await database.listCollections({ name: collectionName }).hasNext();
        
        if (!collectionExists) {
            // Collection doesn't exist, MongoDB will create it automatically
            console.log(`Collection "${collectionName}" doesn't exist. MongoDB will create it automatically.`);
        }
    } finally {
        // Close the client connection
        await client.close();
    }
}
async function dele(subjects) {
    
        await client.connect(); // Connect to MongoDB
        console.log("Connected to MongoDB");

        const dbName = "Material";
        const collectionName = "material";
        const collection_exam_paper = "exam_paper";
        const collection_subjects = "subjects";

        const db = client.db(dbName);
        console.log({subject:subjects})
        try{
        // Delete from subjects collection
        const collectionName1 = db.collection(collection_subjects);
        const deleteResult1 = await collectionName1.deleteMany({subject:subjects});
        console.log(`Deleted ${deleteResult1.deletedCount} documents from subjects collection`);

        // Delete from material collection
        const subjectsCollection = db.collection(collectionName);
        const deleteResult2 = await subjectsCollection.deleteMany({subject:subjects});
        console.log(`Deleted ${deleteResult2.deletedCount} documents from material collection`);

        // Delete from exam_paper collection
        const examPaperCollection = db.collection(collection_exam_paper);
        const deleteResult3 = await examPaperCollection.deleteMany({subject:subjects});
        console.log(`Deleted ${deleteResult3.deletedCount} documents from exam_paper collection`);

        console.log(`Documents with subject name '${subject}' deleted from all collections`);
    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        // Close the client connection
        //await client.close();
        console.log("Connection closed");
    }
}




async function create(subject) {
    try {
        await client.connect(); // Connect to MongoDB
        const dbName = "Material";
        const collectionName = "subjects";

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        console.log("subject in create ",subject)

        // Insert document with subject and link
        const result = await collection.insertOne(subject);

        // If document was inserted successfully
        if (result.insertedCount === 1) {
            console.log(`Material added successfully with ID: ${result.insertedId}`);
        }
    } finally {
        // Close the client connection
        await client.close();
    }
}


async function upload(link, subject,module,semester) {

    try {
        await client.connect(); // Connect to MongoDB
        const dbName = "Material";
        const collectionName = "material";

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Insert document with subject and link
        const result = await collection.insertOne({ subject, link,module,semester });
        console.log("okkkkkkkkkkkkkkkkk")
        // If document was inserted successfully
        if (result.insertedCount === 1) {
            console.log(`Material added successfully with ID: ${result.insertedId}`);
        }
    } finally {
        // Close the client connection
        await client.close();
    }
}

async function eaxmupload(link, subject, Exam_Term,semester) {
    try {
        await client.connect(); // Connect to MongoDB
        const dbName = "Material";
        const collectionName = "exam_paper";

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Insert document with subject and link
        const result = await collection.insertOne({ subject, link,Exam_Term,semester });

        // If document was inserted successfully
        if (result.insertedCount === 1) {
            console.log(`Material added successfully with ID: ${result.insertedId}`);
        }
    } finally {
        // Close the client connection
        await client.close();
    }
}


// Execute the main function
databsecreation();


function getlink(link){
    link=link.split("/")[5]
    link="https://drive.google.com/thumbnail?id="+link;
    return link;
}

async function getsub() {
    try {
        await client.connect(); // Connect to MongoDB
        const dbName = "Material";
        const collectionName = "subjects";

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Insert document with subject and link
        //const result = await collection.find('subject').toArray();
        const result = await collection.find({}).toArray();
        console.log("your doc = ",result)
        let subjects = result.map(doc => doc.subject);
        // Include only the _id field

        // Retrieve all documents with only the _id field
        
        //const result = await collection.insertOne({ subject });
        
        console.log(subjects);

        return subjects
        // If document was inserted successfully
        
    } finally {
        // Close the client connection
        await client.close();
    }
}
async function edit(subject,module1,semester,collection1) {
    try {
        await client.connect(); // Connect to MongoDB
        const dbName = "Material";
        const collectionName =collection1;

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        if (collection1==="material"){
            

            const query = {
                "subject": subject,
                "module": module1,
                semester: semester,   
            };
        console.log(query)
        const result = await collection.find(query).toArray();

        console.log("Matching elements:", result);
        
        const updatedResults = result.map(result => {
            // Create a new object with the modified property name
            return {
                ...result,
                module: result.Exam_Term, 
                collection:collection1// Rename the property to 'semester'
            };
        });
        
        console.log(updatedResults);

        console.log("Matching elements:", result);
        return updatedResults;

    }
    else{

        const query = {
            "subject": subject,
            "Exam_Term": module1,
            semester: semester,  
        };
        
        console.log(query)
        const result = await collection.find(query).toArray();
        
        const updatedResults = result.map(result => {
            // Create a new object with the modified property name
            return {
                ...result,
                module: result.Exam_Term, 
                collection:collection1// Rename the property to 'semester'
            };
        });
        
        console.log(updatedResults);

        console.log("Matching elements:", result);
        return updatedResults;

    }

        // Find all elements that match the query criteri



        // If document was inserted successfully
        
    } finally {
        // Close the client connection
        await client.close();
    }
}
// Serve the HTML file
app.get('/',async (req, res) => {
    console.log("ok 1")
    let allsubjects= await getsub()
     console.log("okkkkkkkkkkkkkkkkk")
    //const allsubjects = ["Math", "Science", "History", "English"];
    res.render(__dirname + '/index.ejs', { allsubjects});
});
// Define a route for rendering the mresult.ejs template
app.get('/mresults', async(req, res) => {
    // Render the mresult.ejs template
    console.log("req................",req.query)
    const subject = req.query.subject; // "math"
    const module = req.query.module;   // "algebra"
    const semester = req.query.semester; // "spring"
    const collection = req.query.collection; 
    
    resut=await edit(subject,module,semester,collection)
    console.log("result = ", resut)
    allsubjects=await getsub();
    res.render( __dirname+'/mresults.ejs',{resut:resut,allsubjects:allsubjects});
});
// Handle form submissions
app.post('/upload', async (req, res) => {
    
    let subject=req.body.edit_subject; 
    let link  = req.body.link;
    let module=req.body.module
    let semester=req.body.semester;
    if (!link)
    {
        console.log(link, " went to not link")
        const collection="material"
        

        return res.redirect(`/mresults?subject=${encodeURIComponent(subject)}&module=${encodeURIComponent(module)}&semester=${encodeURIComponent(semester)}&collection=${encodeURIComponent(collection)}`);
        
    }
    if (link && subject && module) {

        try {
            await upload(link, subject, module,semester);
            res.send('Form submitted successfully!');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error!');
        }
    } else {
        res.status(400).send('Bad Request: Missing link or subject!');
    }
});
app.post('/exampdflink', async (req, res) => {
    
    let subject=req.body.subjects; 
    let link  = req.body.link;
    let Exam_Term=req.body.Exam_Term;
    let semester=req.body.semester;

    if (!link)
    {
        console.log(link, " went to not link")
        //edit(subject,Exam_Term,semester,"exam_paper")
        collection="exam_paper"
        return res.redirect(`/mresults?subject=${encodeURIComponent(subject)}&module=${encodeURIComponent(Exam_Term)}&semester=${encodeURIComponent(semester)}&collection=${encodeURIComponent(collection)}`);
        
    }
   
    if (link && subject && module) {

        try {
            await eaxmupload(link, subject, Exam_Term,semester);
            res.send('Form submitted successfully!');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error!');
        }
    } else {
        res.status(400).send('Bad Request: Missing link or subject!');
    }
});
app.post('/create', async (req, res) => {
    let subject = req.body.newsub
    let link=req.body.newsublink
    link=getlink(link);
    console.log("you subject ",subject);
    subject={ subject: subject, link: link };
    console.log("you subject ",subject);
    console.log("ur link  ",subject, "   end of link")
    if (subject && link) {
    try {
        create(subject);
        res.send('Form submitted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error!');
    } }
     else {
        res.status(400).send('Bad Request: Missing subject!');
    }
    
    //const { subject, link } = req.body;
    console.log(req.body)});


    
async function deleteDocument(collectionName, id) {
    try {
        await client.connect();
        const db = client.db("Material");
        console.log(collectionName,id, "      ggggggggggg")
        const collection = db.collection(collectionName);

        //const objectId = new ObjectId(id);
        const result = await collection.deleteMany({ link: id });

        if (result.deletedCount === 1) {
            console.log("Document deleted successfully.");
            return { success: true, message: "Document deleted successfully." };
        } else {
            console.log("Document not found or not deleted.");
            return { success: false, message: "Document not found or not deleted." };
        }
    } catch (err) {
        console.error("Error deleting document:", err);
        throw err; // Rethrow the error to be handled by the caller
    } finally {
        await client.close();
    }
}

app.post('/delete', (req, res) => {
    console.log(req.body)
    console.log("delete entry ")
    
    const subject = req.body.subjects;
    console.log(subject)

    if (subject) {
        try {
            dele(subject);
            res.send('Form submitted successfully!');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error!');
        }
    } else {
        res.status(400).send('Bad Request: Missing subject!');
    }
});


app.post('/update/:id', async (req, res) => {
    const id = req.body.link;
    const collectionName = req.body.collection; // Assuming collection name is provided as query parameter
    console.log(req.body)
    try {
        console.log(collectionName,id)
        const deletionResult = await deleteDocument(collectionName, id);
        if (deletionResult.success) {
            res.status(200).send(deletionResult.message);
        } else {
            res.status(404).send(deletionResult.message);
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

app.get('/exam_paper/:id/:modu', async (req, res) => {
    try {
        const id = req.params.id;
        const mod=req.params.modu;
        await client.connect();
        const db = client.db("Material");
        const collection = db.collection("exam_paper"); // Replace "your_collection_name_here" with your actual collection name
        
        const subjects = await collection.find({ semester: id ,'Exam_Term':mod}).toArray();
        console.log(id ,mod," jjjjjjjjjjjjj",subjects)

        res.json(subjects);
    } catch (err) {
        console.error("Error retrieving subjects:", err);
        res.status(500).send('Internal server error');
    } finally {
        await client.close();
    }
});


// Define a route to get all subjects for the first semester
app.get('/subjects/:id/:modu', async (req, res) => {
    try {
        const id = req.params.id;
        const mod=req.params.modu;
        await client.connect();
        const db = client.db("Material");
        const collection = db.collection("material"); // Replace "your_collection_name_here" with your actual collection name
        
        const subjects = await collection.find({ semester: id ,'module':mod}).toArray();
        console.log(id,mod ," jjjjjjjjjjjjj",subjects)

        res.json(subjects);
    } catch (err) {
        console.error("Error retrieving subjects:", err);
        res.status(500).send('Internal server error');
    } finally {
        await client.close();
    }
});



// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
