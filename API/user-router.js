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

const whitePath = ['/updateFBToken']

const userRouter = express.Router()

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const UserRouter = (mainManager) => {
    userRouter.use((req, res, next) => {
        if (whitePath.includes(req.path)) {
            next()
            return
        }
        const { error, _ } = userSchema.validate(req.body)
        if (error) {
            logger.info(`[User-Router]-[Params Error] ${error.message}`)
            res.status(400).json(failedResponse(error.message))
            return
        }
        next()
    })

    userRouter.post('/create', async (req, res) => {
        const data = req.body
        try {
            await mainManager.createAccount(data.email, data.password)
            logger.info(`[User-Router]-[Success] User create: ${data.email}`)
        } catch (error) {
            res.status(400).json(failedResponse(error.message))
            logger.info(`[User-Router]-[Failed] User create: ${data.email}`)
            return
        }

        res.status(200).json(successResponse({ 'email': data.email }))
    })

    userRouter.post('/login', async (req, res) => {
        const data = req.body

        try {
            const uid = await mainManager.loginAccount(data.email, data.password)
            logger.info(`[User-Router]-[Success] User login: ${data.email}`)
            res.status(200).json(successResponse({ 'email': data.email, 'uid': uid }))
        } catch (error) {
            res.status(400).json(failedResponse(error.message))
            logger.info(`[User-Router]-[Failed] User login: ${data.email}`)
            return
        }
    })

    userRouter.post('/updateFBToken', async (req, res) => {
        const data = req.body
        if (data.fbToken === undefined) {
            res.status(400).json(failedResponse('No fbToken'))
            logger.info(`[User-Router]-[Failed] User: ${data.uid}, Update FB token`)
            return
        }
        const uid = req.uid
        const fbToken = data.fbToken
        try {
            await mainManager.updateFBToken(uid, fbToken)
            logger.info(`[User-Router]-[Success] User: ${uid}, Update FB token`)
        } catch (error) {
            res.status(400).json(failedResponse(error.message))
            logger.info(`[User-Router]-[Failed] User: ${uid}, Update FB token`)
            return
        }

        res.status(200).json(successResponse({ 'uid': uid }))
    })

    return userRouter
}