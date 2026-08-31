import { createError, defineEventHandler, readBody } from 'h3'
import { executeRunMock, parseRunCode } from '../utils/runMock'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = parseRunCode(body)

  if (code === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Code is required and must be a non-empty string'
    })
  }

  return executeRunMock(code)
})
