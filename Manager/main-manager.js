/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/06.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import dotenv from 'dotenv'

import { MongoDBManager } from "../MongoModule/db-manager.js"
import { FirebaseManager } from "../FirebaseModule/fb-manager.js"
import { SingleUserManager } from '../SingleUserManager/single-user-manager.js'
import { logger } from '../Logger/logger.js';

class MainManager {
    constructor() {
        dotenv.config()
        this.dbManager = new MongoDBManager(process.env.MONGODB_URL)
        this.firebaseManager = new FirebaseManager()
        this.users = {}
    }

    async initialization() {
        await this.dbManager.startConnection()
    }

    async destroy() {
        await this.dbManager.destory()
    }

    async loginAccount(email, uid) {
        await this.firebaseManager.verifyUser(email, uid)
        const userInfo = await this.dbManager.getUserInfo(uid)
        if (!userInfo) {
            await this.dbManager.createUserInfo(email, uid)
        }
        return uid
    }

    async deleteAccount(uid) {
        await this.stopMonitor(uid)
        await this.dbManager.deleteUserInfo(uid)
        await this.dbManager.deleteAllMonitorUrls(uid)
        await this.dbManager.deleteToken(uid)
    }

    async createToken(uid) {
        return await this.dbManager.createToken(uid)
    }

    async deleteToken(uid) {
        return await this.dbManager.deleteToken(uid)
    }

    async refreshToken(uid, token) {
        return await this.dbManager.refreshToken(uid, token)
    }

    async verifyToken(uid, token) {
        return await this.dbManager.verifyToken(uid, token)
    }

    async createMonitorUrl(owner, url) {
        await this.dbManager.createMonitorUrl(owner, url)
        if (this.users[owner]) {
            this.users[owner].updateUrls()
        }
    }

    async deleteMonitorUrl(owner, url) {
        await this.dbManager.deleteMonitorUrl(owner, url)
        if (this.users[owner]) {
            this.users[owner].updateUrls()
        }
    }

    async getMonitorUrls(owner) {
        return await this.dbManager.getMonitorUrls(owner)
    }

    async getUserInfo(uid) {
        return await this.dbManager.getUserInfo(uid)
    }

    async startMonitor(uid, period = '0 */1 * * *') {
        const userInfo = await this.dbManager.getUserInfo(uid)
        if (!this.users[uid]) {
            this.users[uid] = new SingleUserManager(this.dbManager, uid, userInfo.fbToken)
        }
        this.users[uid].startMonitor(period)
        await this.dbManager.changeMonitorStatus(uid, true)
    }

    async stopMonitor(uid) {
        if (this.users[uid]) {
            this.users[uid].job.cancel()
            delete this.users[uid]
        }
        await this.dbManager.changeMonitorStatus(uid, false)
    }

    async monitorImmediately(uid) {
        if (this.users[uid]) {
            this.users[uid].checkUrls()
        }
    }

    async updateFBToken(uid, fbToken) {
        await this.dbManager.updateFBToken(uid, fbToken)
        if (this.users[uid]) {
            this.users[uid].fbToken = fbToken
        }
    }

    async restartMonitor(period = '0 */1 * * *') {
        try {
            const users = await this.dbManager.getStartMonitorUser()
            for (const user of users) {
                await this.startMonitor(user.uid, period)
                logger.info(`[Main-Manager] Restart monitor for user: ${user.email}`)
            }
        } catch (error) {
            logger.error(`[Main-Manager] Fail restart: ${error.message}`)
        }
    }
}

export { MainManager }
