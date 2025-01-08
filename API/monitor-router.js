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
import Joi from 'joi'

const monitorRouter = express.Router()

const monitorSchema = Joi.object({
    owner: Joi.string().required()
})

monitorRouter.use((req, res, next) => {
    const { error, _ } = monitorSchema.validate(req.body)
    if (error) {
        res.status(400).json({
            'success': false,
            'message': error.message,
            'data': {}
        })
        return
    }
    next()
})

export const MonitorRouter = (mainManager) => {
    monitorRouter.post('/start', (req, res) => {
        const data = req.body
        mainManager.startMonitor(data.owner)

        res.status(200).json({
            'success': true,
            'message': 'Monitor started',
            'data': {
                'owner': data.owner
            }
        })
    })

    monitorRouter.post('/stop', (req, res) => {
        const data = req.body
        mainManager.stopMonitor(data.owner)

        res.status(200).json({
            'success': true,
            'message': 'Monitor stopped',
            'data': {
                'owner': data.owner
            }
        })
    })

    return monitorRouter
}