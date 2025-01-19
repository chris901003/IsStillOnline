/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/06.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth'
import { admin } from './fb-admin.js'

class FirebaseAuthManager {
    constructor() {
        this.auth = getAuth()
    }

    async verifyUser(email, uid) {
        try {
            const userRecord = await admin.auth().getUser(uid)
            if (userRecord.email !== email) {
                throw new Error(`Email and uid not match`)
            }
        } catch (error) {
            throw new Error(`Uid is not found: ${error.message}`)
        }
    }
}

export { FirebaseAuthManager }