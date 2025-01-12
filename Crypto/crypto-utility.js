/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/12.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import crypto from 'crypto'
import dotenv from 'dotenv'


class CryptoUtility {
    constructor() {
        dotenv.config()
     }

    signToken(payload) {
        const secret = process.env.CRYPTO_SECRET
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
        const signature = crypto.createHmac('sha256', secret).update(base64Payload).digest('base64')
        return `${base64Payload}.${signature}`
    }

    verifyToken(payload) {
        try {
            const [base64Payload, signature] = payload.split('.')
            const expectedSignature = crypto.createHmac('sha256', process.env.CRYPTO_SECRET).update(base64Payload).digest('base64')

            if (signature !== expectedSignature) {
                throw new Error('Invalid signature')
            }

            return JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf-8'))
        } catch (error) {
            throw new Error(`Unable to verify token: ${error.message}`)
        }
    }
}

export { CryptoUtility }