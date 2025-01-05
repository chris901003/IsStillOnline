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

async function checkStatus(url) {
    try {
        const response = await axios.get(url)
        return response.status
    } catch (error) {
        throw new Error(`Unable to connect to server: ${error.message}`)
    }
}

function loadTargetUrls() {
    const urls = fs.readFileSync('target-urls.txt', 'utf8').split('\n').map(url => url.trim()).filter(url => url.length > 0)
    return urls
}

async function checkUrls(urls) {
    let reports = []
    for (const url of urls) {
        try {
            const status = await checkStatus(url)
            reports.push(`[Success] - ${url} - ${status}`)
        } catch (error) {
            reports.push(`[Failed] - ${url} - ${error.message}`)
        }
    }
    return reports
}

function genMailInfo(reports) {
    const currentTime = new Date().toLocaleString()
    const reportInfo = reports.join('\n')
    return currentTime + "\n" + reportInfo + "\n" + currentTime
}

async function sendEmail(mailInfo) {
    const transporter = nodemailer.createTransport({
        'host': 'smtp.gmail.com',
        'port': 587,
        'secure': false,
        'auth': {
            'user': sensitiveData.emailAddress,
            'pass': sensitiveData.emailAppPassword
        }
    })

    const mailOptions = {
        'from': {
            name: "Service",
            address: sensitiveData.delegateEmail
        },
        'to': sensitiveData.targetEmailAddress,
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

async function main() {
    const targetUrls = loadTargetUrls()
    console.log(targetUrls)
    const checkReports = await checkUrls(targetUrls)
    const mailInfo = genMailInfo(checkReports)
    sendEmail(mailInfo)
}

function loadSensitiveData() {
    const data = fs.readFileSync('sensitive.json', 'utf8')
    return JSON.parse(data)
}

const sensitiveData = loadSensitiveData()
main()

const halfHourlyJob = schedule.scheduleJob('*/30 * * * *', main)
