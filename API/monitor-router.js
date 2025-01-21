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

import { logger } from '../Logger/logger.js'
import { successResponse } from './common-response.js'

const monitorRouter = express.Router()

export const MonitorRouter = (mainManager) => {
    monitorRouter.get('/start', async (req, res) => {
        const uid = req.uid
        await mainManager.startMonitor(uid)

        logger.info(`[Monitor-Router]-[Success] User: ${uid}, Start monitor`)
        res.status(200).json(successResponse({ 'owner': uid }))
    })

    monitorRouter.get('/stop', async (req, res) => {
        const uid = req.uid
        await mainManager.stopMonitor(uid)

        logger.info(`[Monitor-Router]-[Success] User: ${uid}, Stop monitor`)
        res.status(200).json(successResponse({ 'owner': uid }))
    })

    monitorRouter.get('/status', async (req, res) => {
        const uid = req.uid
        const userInfo = await mainManager.getUserInfo(uid)

        logger.info(`[Monitor-Router]-[Success] User: ${uid}, Get monitor status: ${userInfo.isMonitor}`)
        res.status(200).json(successResponse({ 'uid': uid, 'status': userInfo.isMonitor }))
    })

    monitorRouter.get('/immediate', async (req, res) => {
        const uid = req.uid
        await mainManager.monitorImmediately(uid)

        logger.info(`[Monitor-Router]-[Success] User: ${uid}, Immediate check`)
        res.status(200).json(successResponse({ 'owner': uid }))
    })

    return monitorRouter
}