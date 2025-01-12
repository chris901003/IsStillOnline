/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/06.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import { initializeApp } from 'firebase/app'
import dotenv from 'dotenv'
import { FirebaseAuthManager } from './fb-auth.js'

dotenv.config()

class FirebaseManager {
    constructor() {
        this.app = initializeApp(this.firebaseConfig)
        this.authManager = new FirebaseAuthManager()
    }

    async createUser(email, password) {
        try {
            const response = await this.authManager.createUser(email, password)
            return response.user.uid
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`)
        }
    }

    async loginUser(email, password) {
        try {
            const response = await this.authManager.loginUser(email, password)
            return response.user.uid
        } catch (error) {
            throw new Error(`Failed to login user: ${error.message}`)
        }
    }
}

FirebaseManager.prototype.firebaseConfig = {
    apiKey: process.env.FBC_API_KEY,
    authDomain: process.env.FBC_AUTH_DOMAIN,
    projectId: process.env.FBC_PROJECT_ID,
    storageBucket: process.env.FBC_STORAGE_BUCKET,
    messagingSenderId: process.env.FBC_MESSAGING_SENDER_ID,
    appId: process.env.FBC_APP_ID,
    measurementId: process.env.FBC_MEASUREMENT_ID
}

export { FirebaseManager }