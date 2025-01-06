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

class FirebaseAuthManager {
    constructor() {
        this.auth = getAuth()
    }

    async createUser(email, password) {
        try {
            return await createUserWithEmailAndPassword(this.auth, email, password)
        } catch (error) {
            throw new Error(`Unable to create user: ${error.message}`)
        }
    }

    async loginUser(email, password) {
        try {
            return await signInWithEmailAndPassword(this.auth, email, password)
        } catch (error) {
            throw new Error(`Unable to login user: ${error.message}`)
        }
    }
}

export { FirebaseAuthManager }