/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/19.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import admin from 'firebase-admin'
import dotenv from 'dotenv'


class NotificationManager {
    constructor() {
        dotenv.config()

        const serviceAccount = {
            type: process.env.FBA_type,
            project_id: process.env.FBA_project_id,
            private_key_id: process.env.FBA_private_key_id,
            private_key: process.env.FBA_private_key.replace(/\\n/g, '\n'),
            client_email: process.env.FBA_client_email,
            client_id: process.env.FBA_client_id,
            auth_uri: process.env.FBA_auth_uri,
            token_uri: process.env.FBA_token_uri,
            auth_provider_x509_cert_url: process.env.FBA_auth_provider_x509_cert_url,
            client_x509_cert_url: process.env.FBA_client_x509_cert_url,
            universal_domain: process.env.FBA_universe_domain
        }

        this.admin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
    }

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
            let response = await this.admin.messaging().send(message)
            console.log('Successfully sent message:', response)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }
}

export { NotificationManager }