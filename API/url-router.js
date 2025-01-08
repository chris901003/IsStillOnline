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

const urlRouter = express.Router()

export const UrlRouter = (mainManager) => {
    urlRouter.post('/create', async (req, res) => {
        const data = req.body
        console.log(data)

        if (!data.owner || !data.url) {
            res.status(400).json({
                'success': false,
                'message': 'Missing owner or url',
                'data': {}
            })
            return
        }

        await mainManager.createMonitorUrl(data.owner, data.url)

        res.status(200).json({
            'success': true,
            'message': 'Monitor url created',
            'data': {
                'owner': data.owner,
                'url': data.url
            }
        })
    })

    urlRouter.post('/delete', async (req, res) => {
        const data = req.body
        console.log(data)

        if (!data.owner || !data.url) {
            res.status(400).json({
                'success': false,
                'message': 'Missing owner or url',
                'data': {}
            })
            return
        }

        await mainManager.deleteMonitorUrl(data.owner, data.url)

        res.status(200).json({
            'success': true,
            'message': 'Monitor url deleted',
            'data': {
                'owner': data.owner,
                'url': data.url
            }
        })
    })

    urlRouter.get('/get', async (req, res) => {
        const owner = req.query.owner
        console.log(owner)

        if (!owner) {
            res.status(400).json({
                'success': false,
                'message': 'Missing owner',
                'data': {}
            })
            return
        }

        const urls = await mainManager.getMonitorUrls(owner)

        res.status(200).json({
            'success': true,
            'message': 'Monitor urls',
            'data': {
                'owner': owner,
                'urls': urls
            }
        })
    })

    return urlRouter
}