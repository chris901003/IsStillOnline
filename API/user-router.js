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

const userRouter = express.Router()

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const UserRouter = (mainManager) => {
    userRouter.use((req, res, next) => {
        const { error, _ } = userSchema.validate(req.body)
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

    userRouter.post('/create', async (req, res) => {
        const data = req.body
        await mainManager.createAccount(data.email, data.password)

        res.status(200).json({
            'success': true,
            'message': 'User created',
            'data': { 'email': data.email }
        })
    })

    userRouter.post('/login', async (req, res) => {
        const data = req.body

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