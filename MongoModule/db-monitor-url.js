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

class DBMonitorUrl {
    constructor() { }

    async createMonitorUrl(owner, url) {
        const monitorUrl = new this.MonitorUrlModel({
            'owner': owner,
            'url': url
        })
        try {
            await monitorUrl.save()
        } catch (error) {
            throw new Error(`Unable to create monitor url: ${error.message}`)
        }
    }

    async deleteMonitorUrl(owner, url) {
        try {
            await this.MonitorUrlModel.deleteOne({ 'owner': owner, 'url': url })
        } catch (error) {
            throw new Error(`Unable to delete monitor url: ${error.message}`)
        }
    }
}

DBMonitorUrl.prototype.MonitorUrlSchema = new Schema({
    'owner': {
        type: String,
        required: true
    },
    'url': {
        type: String,
        required: true
    }
})

DBMonitorUrl.prototype.MonitorUrlModel = mongoose.model('MonitorUrl', DBMonitorUrl.prototype.MonitorUrlSchema)

export { DBMonitorUrl }