/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/12.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import mongoose from "mongoose"
import { Schema } from "mongoose"
import { v4 as uuidv4 } from "uuid"

import { MongoDBManager } from "./db-manager.js"

class DBToken {
    constructor() { }

    async createToken(uid) {
        const token = {
            'uid': uid,
            'token': uuidv4(),
            'tokenExpireTime': new Date(Date.now() + 1000 * 60 * 60),
            'refreshToken': uuidv4(),
            'refreshTokenExpireTime': new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        }
        try {
            const result = await this.TokenModel.findOneAndUpdate(
                { uid }, 
                { $set: token }, 
                { upsert: true, new: true }
            )
            return result
        } catch (error) {
            throw new Error(`Unable to create token: ${error.message}`)
        }
    }

    async deleteToken(uid) {
        try {
            await this.TokenModel.deleteOne({ 'uid': uid })
        } catch (error) {
            throw new Error(`Unable to delete token: ${error.message}`)
        }
    }

    async refreshToken(uid, token) {
        try {
            const data = await this.TokenModel.findOne({ 'uid': uid })
            if (data.refreshToken !== token) {
                throw new Error('Invalid refresh token')
            }
            if (data.refreshTokenExpireTime < new Date()) {
                throw new Error('Refresh token expired')
            }
            return this.createToken(uid)
        } catch (error) {
            throw new Error(`Unable to refresh token: ${error.message}`)
        }
    }
    
    async verifyToken(uid, token) {
        try {
            const data = await this.TokenModel.findOne({ 'uid': uid })
            if (data.token !== token) {
                throw new Error('Invalid token')
            } else if (data.tokenExpireTime < new Date()) {
                throw new Error('Token expired')
            }
            return true
        } catch (error) {
            throw new Error(`Unable to verify token: ${error.message}`)
        }
    }
}

DBToken.prototype.TokenSchema = new Schema({
    'uid': {
        type: String,
        required: true,
        unique: true
    },
    'token': String,
    'tokenExpireTime': Date,
    'refreshToken': String,
    'refreshTokenExpireTime': Date
})

DBToken.prototype.TokenModel = mongoose.model('Token', DBToken.prototype.TokenSchema)

export { DBToken }

test()
async function test() {
    const dbManager = new MongoDBManager("mongodb://superuser:supersecurepassword@localhost:27017/IsStillOnlineDB")
    await dbManager.startConnection()
    const dbToken = new DBToken()
    try {
        const token = await dbToken.createToken('test')
        console.log(`Verify token: ${token.token}`)
        const verify = await dbToken.verifyToken('test', token.token)
        console.log(verify)
    } catch (error) {
        console.error(error)
    }
}