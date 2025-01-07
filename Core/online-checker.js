/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/07.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import axios from 'axios'

class OnlineCheckerResultData {
    constructor(url, statusCode) {
        this.url = url
        this.statusCode = statusCode
        
        if (statusCode === -1) {
            this.status = 'Failed'
        } else if (100 <= statusCode && statusCode < 200) {
            this.status = 'Informational'
        } else if (200 <= statusCode && statusCode < 300) {
            this.status = 'Success'
        } else if (300 <= statusCode && statusCode < 400) {
            this.status = 'Redirection'
        } else if (400 <= statusCode && statusCode < 500) {
            this.status = 'Client Error'
        } else if (500 <= statusCode && statusCode < 600) {
            this.status = 'Server Error'
        } else {
            this.status = 'Unknown'
        }
    }
}

class OnlineChecker {
    constructor(urls) {
        this.urls = urls
    }

    async #checkStatus(url) {
        try {
            const response = await axios.get(url)
            return response.status
        } catch (error) {
            throw new Error(`Unable to connect to server: ${error.message}`)
        }
    }

    async check() {
        const results = []
        for (const url of this.urls) {
            try {
                const statusCode = await this.#checkStatus(url)
                results.push(new OnlineCheckerResultData(url, statusCode))
            } catch (error) {
                results.push(new OnlineCheckerResultData(url, -1))
            }
        }
        return results
    }
}

export { OnlineChecker, OnlineCheckerResultData }