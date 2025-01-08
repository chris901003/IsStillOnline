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

const userRouter = express.Router()

export const UserRouter = (mainManager) => {
    userRouter.post('/create', async (req, res) => {
        const data = req.body
        console.log(data)

        if (!data.email || !data.password) {
            res.status(400).json({
                'success': false,
                'message': 'Missing email or password',
                'data': {}
            })
            return
        }

        await mainManager.createAccount(data.email, data.password)

        res.status(200).json({
            'success': true,
            'message': 'User created',
            'data': { 'email': data.email }
        })
    })

    userRouter.post('/login', async (req, res) => {
        const data = req.body
        console.log(data)

        if (!data.email || !data.password) {
            res.status(400).json({
                'success': false,
                'message': 'Missing email or password',
                'data': {}
            })
            return
        }

        const uid = await mainManager.loginAccount(data.email, data.password)

        res.status(200).json({
            'success': true,
            'message': 'User login',
            'data': {
                'email': data.email,
                'uid': uid
            }
        })
    })

    return userRouter
}