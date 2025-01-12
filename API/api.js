/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/08.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import express from 'express'
import { UserRouter } from './user-router.js'
import { UrlRouter } from './url-router.js'
import { MonitorRouter } from './monitor-router.js'
import { TokenRouter } from './token-router.js'

class APIManager {
    constructor(mainManager) {
        this.mainManager = mainManager
        this.app = express()
        this.generateAPI()
        this.startServer()
        this.forTestApi()
    }

    startServer() {
        this.app.listen(3000, '0.0.0.0', () => {
            console.log('Server is running on port 3000')
        })
    }

    generateAPI() {
        this.app.use(express.json())

        // For user API
        this.app.use('/user', UserRouter(this.mainManager))

        // For Url API
        this.app.use('/url', UrlRouter(this.mainManager))

        // For Monitor API
        this.app.use('/monitor', MonitorRouter(this.mainManager))

        // For Token API
        this.app.use('/token', TokenRouter(this.mainManager))
    }

    forTestApi() {
        this.app.get('/test', (req, res) => {
            res.send('Hello World!')
        })
    }
}

export { APIManager }