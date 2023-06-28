import { logger } from 'api/src/lib/logger'

export const log = (message: string, level: 'info' | 'error' = 'info') => {
  if (process.env.NODE_ENV === 'production') {
    if (level === 'info') {
      logger.info(message)
    } else {
      logger.error(message)
    }
  } else {
    console.log(message)
  }
}
