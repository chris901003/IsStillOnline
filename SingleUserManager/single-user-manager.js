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

class SingleUserManager {
    constructor(dbManager, uid) {
        this.uid = uid
        this.dbManager = dbManager
        this.emailManager = new EmailManager()
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
        this.emailManager.sendReport(reports)
    }

    startMonitor(period = '* */1 * * *') {
        if (this.job) {
            console.log('Cancel the previous job')
            this.job.cancel()
        }
        this.job = schedule.scheduleJob(period, () => this.#checkUrls())
    }
}

export { SingleUserManager }