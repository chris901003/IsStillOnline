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

    async getUserInfo(uid) {
        try {
            const userInfo = await this.UserInfoModel.findOne({ 'uid': uid })
            return userInfo
        } catch (error) {
            throw new Error(`Unable to get user info: ${error.message}`)
        }
    }

    async changeMonitorStatus(uid, status) {
        try {
            const userInfo = await this.UserInfoModel.findOne({ 'uid': uid })
            userInfo.isMonitor = status
            await userInfo.save()
        } catch (error) {
            throw new Error(`Unable to change monitor status: ${error.message}`)
        }
    }

    async getStartMonitorUser() {
        try {
            const users = await this.UserInfoModel.find({ 'isMonitor': true })
            return users
        } catch (error) {
            throw new Error(`Unable to get start monitor user: ${error.message}`)
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
    },
    'isMonitor': {
        type: Boolean,
        default: false
    }
})

DBUserInfo.prototype.UserInfoModel = mongoose.model('UserInfo', DBUserInfo.prototype.UserInfoSchema)

export { DBUserInfo }