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

import { logger } from '../Logger/logger.js'
import { successResponse, failedResponse } from './common-response.js'

const monitorRouter = express.Router()

const monitorSchema = Joi.object({
    owner: Joi.string().required()
})

monitorRouter.use((req, res, next) => {
    const { error, _ } = monitorSchema.validate(req.body)
    if (error) {
        logger.info(`[Monitor-Router]-[Params Error] ${error.message}`)
        res.status(400).json(failedResponse(error.message))
        return
    }
    next()
})

export const MonitorRouter = (mainManager) => {
    monitorRouter.post('/start', async (req, res) => {
        const data = req.body
        await mainManager.startMonitor(data.owner)

        logger.info(`[Monitor-Router]-[Success] User: ${data.owner}, Start monitor`)
        res.status(200).json(successResponse({ 'owner': data.owner }))
    })

    monitorRouter.post('/stop', async (req, res) => {
        const data = req.body
        await mainManager.stopMonitor(data.owner)

        logger.info(`[Monitor-Router]-[Success] User: ${data.owner}, Stop monitor`)
        res.status(200).json(successResponse({ 'owner': data.owner }))
    })

    return monitorRouter
}