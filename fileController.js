import fs from 'fs'
import { resolve } from 'path/posix'

const basePath = resolve()

export const readJSONFile = path => JSON.parse(fs.readFileSync(resolve(basePath, path), 'utf-8'))