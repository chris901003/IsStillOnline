/*
 * =============================================================================
 * Created by Zephyr-Huang on 2025/01/06.
 * Copyright © 2025 Zephyr-Huang. All rights reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 * =============================================================================
*/

import fs from 'fs'

class Utility {
    static loadSensitiveData(path) {
        const data = fs.readFileSync(path, 'utf8')
        return JSON.parse(data)
    }
}

export { Utility }