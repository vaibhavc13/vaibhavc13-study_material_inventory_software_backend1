const { MongoClient } = require('mongodb');

mongourl="mongodb+srv://v599568:vaibhav1934@cluster0.7vzfh84.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });


async function databsecreation() {
    try {
        
        // Connect to the MongoDB cluster
        await client.connect();
        const dbName = "Material";
        const collection_material = "material";
        collection_exam_paper="exam_paper";
        collection_subjects="subjects";
        
        const dbList = await client.db().admin().listDatabases();
        const dbExists = dbList.databases.some(db => db.name === dbName);
        
        // Establish a connection to the database
        if (dbExists) {
            console.log(`Database "${dbName}" already exists.`);
        } else {
            // Create the database
            const database = client.db(dbName);
            database.collection(collection_material);
            database.collection(collection_exam_paper);
            database.collection(collection_subjects);
            console.log(`Database "${dbName}" created successfully With collentions "${collection_material}".`);
        }

        

       
        const collection = database.collection(collection_material);

        
    } finally {
        // Close the client connection
        await client.close();
    }
}