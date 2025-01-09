/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/06.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import { fileURLToPath } from 'url';
import path from 'path'

import { MongoDBManager } from "../MongoModule/db-manager.js"
import { FirebaseManager } from "../FirebaseModule/fb-manager.js"
import { Utility } from "../Utility/utility.js"
import { SingleUserManager } from '../SingleUserManager/single-user-manager.js'
import { logger } from '../Logger/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sensitiveFilePath = path.join(__dirname, 'sensitive.json')

class MainManager {
    constructor() {
        this.sensitiveData = Utility.loadSensitiveData(sensitiveFilePath)
        this.dbManager = new MongoDBManager(this.sensitiveData.mongoDBUrl)
        this.firebaseManager = new FirebaseManager()
        this.users = {}
    }

    async initialization() {
        await this.dbManager.startConnection()
    }

    async destroy() {
        await this.dbManager.destory()
    }

    async createAccount(email, password) {
        const uid = await this.firebaseManager.createUser(email, password)
        if (!uid) {
            throw new Error(`Unable to create user with email: ${email}`)
        }
        await this.dbManager.createUserInfo(email, uid)
    }

    async loginAccount(email, password) {
        const uid = await this.firebaseManager.loginUser(email, password)
        if (!uid) {
            throw new Error(`Unable to login user with email: ${email}`)
        }
        return uid
    }

    async createMonitorUrl(owner, url) {
        await this.dbManager.createMonitorUrl(owner, url)
    }

    async deleteMonitorUrl(owner, url) {
        await this.dbManager.deleteMonitorUrl(owner, url)
    }

    async getMonitorUrls(owner) {
        return await this.dbManager.getMonitorUrls(owner)
    }

    async startMonitor(uid, period = '0 */1 * * *') {
        if (!this.users[uid]) {
            this.users[uid] = new SingleUserManager(this.dbManager, uid)
        }
        this.users[uid].startMonitor(period)
        await this.dbManager.changeMonitorStatus(uid, true)
    }

    async stopMonitor(uid) {
        if (this.users[uid]) {
            this.users[uid].job.cancel()
        }
        await this.dbManager.changeMonitorStatus(uid, false)
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
