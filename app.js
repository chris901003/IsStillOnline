/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/08.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import { MainManager } from './Manager/main-manager.js'
import { APIManager } from './API/api.js'

async function main() {
    const mainManager = new MainManager()
    await mainManager.initialization()
    const apiManager = new APIManager(mainManager)
}

main()