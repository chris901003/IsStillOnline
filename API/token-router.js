/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/12.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import express from 'express'

import { logger } from '../Logger/logger.js'
import { successResponse, failedResponse } from './common-response.js'
import { CryptoUtility } from '../Crypto/crypto-utility.js'
import { TokenVerifyType } from '../MongoModule/db-token.js'

const tokenRouter = express.Router()
const cryptoUtility = new CryptoUtility()

export const TokenRouter = (mainManager) => {
    tokenRouter.get('/create', async (req, res) => {
        const uid = req.query.uid
        const result = await mainManager.createToken(uid)
        if (!result) {
            logger.error(`[Token-Router]-[Failed] Failed to create token`)
            res.status(500).json(failedResponse('Failed to create token'))
            return
        }
        logger.info(`[Token-Router]-[Success] Token create: ${uid}`)
        const signToken = cryptoUtility.signToken(result)
        res.status(200).json(successResponse({ 'token': signToken }))
    })

    tokenRouter.get('/refresh', async (req, res) => {
        let token = req.token
        try {
            token = cryptoUtility.verifyToken(token)
        } catch {
            logger.info(`[Token-Router]-[Failed] User: ${uid}, Refresh token: Invalid`)
            res.status(401).json(failedResponse('Invalid token'))
            return
        }
        let uid = token.uid
        const result = await mainManager.refreshToken(uid, token.refreshToken)
        if (result === TokenVerifyType.INVALID || result === TokenVerifyType.EXPIRED) {
            logger.info(`[Token-Router]-[Failed] User: ${uid}, Refresh token: ${result}`)
            res.status(401).json(failedResponse(result))
            return
        }
        logger.info(`[Token-Router]-[Success] User: ${uid}, Refresh token`)
        const signToken = cryptoUtility.signToken(result)
        res.status(200).json(successResponse({ 'token': signToken }))
    })

    tokenRouter.get('/verify', async (req, res) => {
        let token = req.token
        try {
            token = cryptoUtility.verifyToken(token)
        } catch {
            logger.info(`[Token-Router]-[Failed] User: ${uid}, Token: Invalid`)
            res.status(401).json(failedResponse('Unauthorized token'))
            return
        }
        let uid = token.uid
        const result = await mainManager.verifyToken(uid, token.token)
        if (result === TokenVerifyType.INVALID || result === TokenVerifyType.EXPIRED) {
            logger.info(`[Token-Router]-[Failed] User: ${uid}, Token: ${result}`)
            res.status(401).json(failedResponse(result))
            return
        }
        logger.info(`[Token-Router]-[Success] User: ${uid}, Token: ${result}`)
        res.status(200).json(successResponse({ 'token': token }))
    })

    tokenRouter.get('/delete', async (req, res) => {
        const uid = req.uid
        await mainManager.deleteToken(uid)
        logger.info(`[Token-Router]-[Success] Token delete: ${uid}`)
        res.status(200).json(successResponse({ 'uid': uid }))
    })
    return tokenRouter
}