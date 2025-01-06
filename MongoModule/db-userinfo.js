/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/06.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import mongoose from "mongoose"
import { Schema } from "mongoose"

class DBUserInfo {
    constructor() { }

    async createUserInfo(email, uid) {
        const userInfo = new this.UserInfoModel({
            'email': email,
            'uid': uid
        })
        try {
            await userInfo.save()
        } catch (error) {
            throw new Error(`Unable to create user info: ${error.message}`)
        }
    }

    async deleteUserInfo(email) {
        try {
            await this.UserInfoModel.deleteOne({ 'email': email })
        } catch (error) {
            throw new Error(`Unable to delete user info: ${error.message}`)
        }
    }
}

DBUserInfo.prototype.UserInfoSchema = new Schema({
    'email': {
        type: String,
        required: true,
        unique: true
    },
    'uid': {
        type: String,
        required: true,
        unique: true
    }
})

DBUserInfo.prototype.UserInfoModel = mongoose.model('UserInfo', DBUserInfo.prototype.UserInfoSchema)

export { DBUserInfo }