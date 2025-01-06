/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/05.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import axios from 'axios'
import fs from 'fs'
import nodemailer from 'nodemailer'
import schedule from 'node-schedule'

class Utility { 
    static loadTargetUrls() {
        const urls = fs.readFileSync('target-urls.txt', 'utf8').split('\n').map(url => url.trim()).filter(url => url.length > 0)
        return urls
    }

    static loadSensitiveData() {
        const data = fs.readFileSync('sensitive.json', 'utf8')
        return JSON.parse(data)
    }
}

class UrlChecker {
    async #checkStatus(url) {
        try {
            const response = await axios.get(url)
            return response.status
        } catch (error) {
            throw new Error(`Unable to connect to server: ${error.message}`)
        }
    }

    async checkUrls(urls) {
        let reports = []
        for (const url of urls) {
            try {
                const status = await this.#checkStatus(url)
                reports.push(`[Success] - ${url} - ${status}`)
            } catch (error) {
                reports.push(`[Failed] - ${url} - ${error.message}`)
            }
        }
        return reports
    }
}

class MailManager {
    constructor() {
        this.sensitiveData = Utility.loadSensitiveData()
    }

    #genMailInfo(reports) {
        const currentTime = new Date().toLocaleString()
        const reportInfo = reports.join('\n')
        return currentTime + "\n" + reportInfo + "\n" + currentTime
    }

    async #sendEmail(mailInfo) {
        const transporter = nodemailer.createTransport({
            'host': 'smtp.gmail.com',
            'port': 587,
            'secure': false,
            'auth': {
                'user': this.sensitiveData.emailAddress,
                'pass': this.sensitiveData.emailAppPassword
            }
        })
    
        const mailOptions = {
            'from': {
                name: "Service",
                address: this.sensitiveData.delegateEmail
            },
            'to': this.sensitiveData.targetEmailAddress,
            'subject': 'URL Monitor Report',
            'text': mailInfo
        }
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(`Unable to send email: ${error.message}`)
            } else {
                console.log(`Email sent: ${info.response}`)
            }
        })
    }

    async sendReport(reports) {
        const mailInfo = this.#genMailInfo(reports)
        this.#sendEmail(mailInfo)
    }
}

class Monitor {
    constructor() {
        this.urlChecker = new UrlChecker()
        this.mailManager = new MailManager()
    }

    async monitor() {
        const targetUrls = Utility.loadTargetUrls()
        console.log(targetUrls)
        const checkReports = await this.urlChecker.checkUrls(targetUrls)
        this.mailManager.sendReport(checkReports)
    }

    start() {
        this.monitor()
        schedule.scheduleJob('*/30 * * * *', () => this.monitor())
    }
}

const monitor = new Monitor()
monitor.start()
