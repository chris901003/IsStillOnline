import mongoose from 'mongoose'

import { DBUserInfo } from './db-userinfo.js'

class MongoDBManager {
    constructor(dbUrl) {
        this.dbUrl = dbUrl
        this.userInfoManager = new DBUserInfo()
    }

    async startConnection() {
        try {
            await mongoose.connect(this.dbUrl)
            console.log('Connected to MongoDB')
        } catch (error) {
            console.error(`Unable to connect to MongoDB: ${error.message}`)
        }
    }

    async destory() {
        try {
            await mongoose.connection.close()
            console.log('Connection to MongoDB closed')
        } catch (error) {
            console.error(`Unable to close connection: ${error.message}`)
        }
    }

    async createUserInfo(email, uid) {
        try {
            await this.userInfoManager.createUserInfo(email, uid)
        } catch (error) {
            console.error(`${error.message}`)
        }
    }

    async deleteUserInfo(email) {
        try {
            await this.userInfoManager.deleteUserInfo(email)
        } catch (error) {
            console.error(`${error.message}`)
        }
    }
}

export { MongoDBManager }