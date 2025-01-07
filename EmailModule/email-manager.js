/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/07.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import { fileURLToPath } from 'url';
import path from 'path'
import nodemailer from 'nodemailer'

import { Utility } from "../Utility/utility.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sensitiveFilePath = path.join(__dirname, 'sensitive.json')

class EmailManager {
    constructor() {
        this.sensitiveData = Utility.loadSensitiveData(sensitiveFilePath)
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
        const currentTime = new Date().toLocaleString()
        const reportInfo = reports.map(report => report.toString()).join('\n')
        const mailInfo = currentTime + "\n" + reportInfo + "\n" + currentTime
        this.#sendEmail(mailInfo)
    }
}

export { EmailManager }