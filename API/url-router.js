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

const urlRouter = express.Router()

const urlSchema = Joi.object({
    owner: Joi.string().required(),
    url: Joi.string().required()
})

function validateUrlData(req, res, next) {
    const { error, _ } = urlSchema.validate(req.body)
    if (error) {
        logger.info(`[Url-Router]-[Params Error] ${error.message}`)
        res.status(400).json(failedResponse(error.message))
        return
    }
    next()
}

export const UrlRouter = (mainManager) => {
    urlRouter.post('/create', validateUrlData, async (req, res) => {
        const data = req.body
        await mainManager.createMonitorUrl(data.owner, data.url)

        logger.info(`[Url-Router]-[Success] User: ${data.owner}, Create monitor url: ${data.url}`)
        res.status(200).json(successResponse({ 'owner': data.owner, 'url': data.url }))
    })

    urlRouter.post('/delete', validateUrlData, async (req, res) => {
        const data = req.body
        await mainManager.deleteMonitorUrl(data.owner, data.url)

        logger.info(`[Url-Router]-[Success] User: ${data.owner}, Delete monitor url: ${data.url}`)
        res.status(200).json(successResponse({ 'owner': data.owner, 'url': data.url }))
    })

    urlRouter.get('/get', async (req, res) => {
        const owner = req.query.owner
        console.log(owner)

        if (!owner) {
            logger.info(`[Url-Router]-[Params Error] Missing owner`)
            res.status(400).json(failedResponse('Missing owner'))
            return
        }

        const urls = await mainManager.getMonitorUrls(owner)

        logger.info(`[Url-Router]-[Success] User: ${owner}, Get monitor urls`)
        res.status(200).json(successResponse({ 'owner': owner, 'urls': urls }))
    })

    return urlRouter
}