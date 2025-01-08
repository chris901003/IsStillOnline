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

const monitorRouter = express.Router()

export const MonitorRouter = (mainManager) => {
    monitorRouter.post('/start', (req, res) => {
        const data = req.body
        console.log(data)

        if (!data.owner) {
            res.status(400).json({
                'success': false,
                'message': 'Missing owner',
                'data': {}
            })
            return
        }

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
        console.log(data)

        if (!data.owner) {
            res.status(400).json({
                'success': false,
                'message': 'Missing owner',
                'data': {}
            })
            return
        }

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