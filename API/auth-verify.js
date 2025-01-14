/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/12.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import { CryptoUtility } from "../Crypto/crypto-utility.js"
import { TokenVerifyType } from "../MongoModule/db-token.js"
import { failedResponse } from "./common-response.js"

const cryptoUtility = new CryptoUtility()

const whilelist = [
    '/user/login',
    '/user/create',
    '/token/create'
]

export const authVerify = (app, mainManager) => {
    app.use((req, res, next) => {
        const path = req.path
        if (whilelist.includes(path)) {
            next()
            return
        }
        verifyToken(mainManager, req, res, next)
    })
}

async function verifyToken(mainManager, req, res, next) {
    let token = req.headers.authorization
    if (!token) {
        res.status(401).send('Unauthorized')
        return
    }
    token = token.replace('Bearer ', '')
    try {
        const decodedToken = cryptoUtility.verifyToken(token)
        const checkResult = await mainManager.verifyToken(decodedToken.uid, decodedToken.token)
        if (checkResult === TokenVerifyType.VALID ) {
            req.uid = decodedToken.uid
            req.token = token
            next()
        } else {
            res.status(401).json(failedResponse('Unauthorized'))
            return
        }
    } catch (error) {
        res.status(401).json(failedResponse('Unauthorized'))
        return
    }
}