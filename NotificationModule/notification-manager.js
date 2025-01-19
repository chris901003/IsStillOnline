/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/19.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import { admin } from '../FirebaseModule/fb-admin.js'


class NotificationManager {
    constructor() { }

    async sendReport(token, reports) {
        // report = [OnlineCheckerResultData]
        let title = 'Monitor Report'
        let body = ''
        for (const report of reports) {
            if (report.statusCode !== 200) {
                body += `${report.toString()}\n`
            }
        }
        if (body === '') {
            body = 'All urls are online\n'
        }
        body += `Time: ${new Date().toLocaleString()}`
        await this.sendNotification(token, title, body)
    }

    async sendNotification(token, title, body) {
        const message = {
            token: token,
            notification: {
                title, body
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };
        try {
            let response = await admin.messaging().send(message)
            console.log('Successfully sent message:', response)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }
}

export { NotificationManager }