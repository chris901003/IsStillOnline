/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/07.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import schedule from 'node-schedule'
import { OnlineChecker } from '../Core/online-checker.js'
import { EmailManager } from '../EmailModule/email-manager.js'
import { NotificationManager } from '../NotificationModule/notification-manager.js'

class SingleUserManager {
    constructor(dbManager, uid, fbToken) {
        this.uid = uid
        this.fbToken = fbToken
        this.dbManager = dbManager
        this.emailManager = new EmailManager()
        this.notificationManager = new NotificationManager()
        this.#start()

        this.onlineChecker = null
        this.job = null
    }

    async #start() {
        await this.updateUrls()
    }

    async updateUrls() {
        this.targetUrls = await this.dbManager.getMonitorUrls(this.uid)
        this.onlineChecker = new OnlineChecker(this.targetUrls)
    }

    async #checkUrls() {
        const reports = await this.onlineChecker.check()
        // this.emailManager.sendReport(reports)
        console.log(`User ${this.uid} reports: ${reports}, fbToken: ${this.fbToken}`)
        if (this.fbToken.length > 0) {
            this.notificationManager.sendReport(this.fbToken, reports)
        }
    }

    startMonitor(period = '0 */1 * * *') {
        if (this.job) {
            console.log('Cancel the previous job')
            this.job.cancel()
        }
        period = '1 * * * * *'
        this.job = schedule.scheduleJob(period, () => this.#checkUrls())
    }
}

export { SingleUserManager }