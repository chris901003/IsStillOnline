import mongoose from 'mongoose'

import { DBUserInfo } from './db-userinfo.js'
import { DBMonitorUrl } from './db-monitor-url.js'
import { DBToken } from './db-token.js'
import { logger } from '../Logger/logger.js'

class MongoDBManager {
    constructor(dbUrl) {
        this.dbUrl = dbUrl
        this.userInfoManager = new DBUserInfo()
        this.monitorUrlManager = new DBMonitorUrl()
        this.tokenManager = new DBToken()
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

    async createToken(uid) {
        try {
            return await this.tokenManager.createToken(uid)
        } catch (error) {
            logger.error(`[DB-Manager] ${error.message}`)
        }
    }

    async deleteToken(uid) {
        try {
            await this.tokenManager.deleteToken(uid)
        } catch (error) {
            logger.error(`[DB-Manager] ${error.message}`)
        }
    }

    async refreshToken(uid, token) {
        try {
            return await this.tokenManager.refreshToken(uid, token)
        } catch (error) {
            logger.error(`[DB-Manager] ${error.message}`)
        }
    }

    async verifyToken(uid, token) {
        return await this.tokenManager.verifyToken(uid, token)
    }

    async createMonitorUrl(owner, url) {
        try {
            await this.monitorUrlManager.createMonitorUrl(owner, url)
        } catch (error) {
            console.error(`${error.message}`)
        }
    }

    async deleteMonitorUrl(owner, url) {
        try {
            await this.monitorUrlManager.deleteMonitorUrl(owner, url)
        } catch (error) {
            console.error(`${error.message}`)
        }
    }

    async getUserInfo(uid) {
        try {
            return await this.userInfoManager.getUserInfo(uid)
        } catch (error) {
            console.error(`${error.message}`)
        }
    }

    async changeMonitorStatus(uid, status) {
        try {
            await this.userInfoManager.changeMonitorStatus(uid, status)
        } catch (error) {
            logger.error(`[DB-Manager] ${error.message}`)
        }
    }

    async getStartMonitorUser() {
        try {
            return await this.userInfoManager.getStartMonitorUser()
        } catch (error) {
            logger.error(`[DB-Manager] ${error.message}`)
        }
    }

    async updateFBToken(uid, fbToken) {
        try {
            await this.userInfoManager.updateFBToken(uid, fbToken)
        } catch (error) {
            logger.error(`[DB-Manager] ${error.message}`)
        }
    }

    async getMonitorUrls(owner) {
        try {
            return await this.monitorUrlManager.getMonitorUrls(owner)
        } catch (error) {
            console.error(`${error.message}`)
        }
    }
}

export { MongoDBManager }