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
import { fileURLToPath } from 'url';
import path from 'path'

import { Utility } from '../Utility/utility.js'
import { FirebaseAuthManager } from './fb-auth.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sensitiveFilePath = path.join(__dirname, 'sensitive.json')
const sensitiveData = Utility.loadSensitiveData(sensitiveFilePath)

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
            console.error(`${error.message}`)
        }
    }

    async loginUser(email, password) {
        try {
            const response = await this.authManager.loginUser(email, password)
            return response.user.uid
        } catch (error) {
            console.error(`${error.message}`)
        }
    }
}

FirebaseManager.prototype.firebaseConfig = sensitiveData.firebaseConfig

export { FirebaseManager }