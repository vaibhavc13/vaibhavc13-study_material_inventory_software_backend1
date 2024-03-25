const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(bodyParser.json());



async function dele(subject) {
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

async function dele(subject) {
    try {
        await client.connect(); // Connect to MongoDB
        const dbName = "Material";
        const collectionName = "material";
        const collection_exam_paper="exam_paper";
        const collection_subjects="subjects";

        const db = client.db(dbName);
                // Delete from subjects collection
        collectionName = db.collection(collection_subjects);
        await collectionName.deleteMany({ subject_name: subject });

        // Delete from subjects collection
        subjectsCollection = db.collection(collectionName);
        await subjectsCollection.deleteMany({ subject_name: subject });

        // Delete from exam_paper collection
        examPaperCollection = db.collection(collection_exam_paper);
        await examPaperCollection.deleteMany({ subject_name: subject });
        // If document was inserted successfully
        
    } finally {
        // Close the client connection
        await client.close();
    }

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
// Serve the HTML file
app.get('/',async (req, res) => {
    console.log("ok 1")
    let allsubjects= await getsub()
     console.log("okkkkkkkkkkkkkkkkk")
    //const allsubjects = ["Math", "Science", "History", "English"];
    res.render(__dirname + '/index.ejs', { allsubjects});
});

// Handle form submissions
app.post('/upload', async (req, res) => {
    
    let subject=req.body.edit_subject; 
    let link  = req.body.link;
    let module=req.body.module
    let semester=req.body.semester;
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

app.post('/delete', (req, res) => {
    console.log("printing body ",req.body)
    
    const subject = req.body.subjects;
    console.log("delete dubjeact ",subject)

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

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
