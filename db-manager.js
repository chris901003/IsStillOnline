import { MongoClient } from 'mongodb'

const url = 'mongodb://superuser:supersecurepassword@localhost:27017/IsStillOnlineDB'

async function connectToDatabase() {
    const client = new MongoClient(url)
    try {
        await client.connect()
        console.log('Connected to database')
    } catch (error) {
        console.error(`Unable to connect to database: ${error.message}`)
    }
}

connectToDatabase()