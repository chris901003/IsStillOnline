/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/07.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

class EmailManager {
    constructor() {
        dotenv.config()
    }

    async #sendEmail(mailInfo) {
        const transporter = nodemailer.createTransport({
            'host': 'smtp.gmail.com',
            'port': 587,
            'secure': false,
            'auth': {
                'user': process.env.EMAIL_ADDRESS,
                'pass': process.env.EMAIL_APP_PASSWORD
            }
        })
    
        const mailOptions = {
            'from': {
                name: "Service",
                address: process.env.DELEGATE_EMAIL
            },
            'to': process.env.TARGET_EMAIL_ADDRESS,
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