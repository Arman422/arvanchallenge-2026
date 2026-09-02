import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { createApp, toNodeListener } from 'h3'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import runHandler from './run.post'
import * as runMock from '../utils/runMock'

describe('POST /api/run handler', () => {
  let server: Server
  let baseUrl = ''

  beforeAll(async () => {
    const app = createApp()
    app.use('/api/run', runHandler)

    server = createServer(toNodeListener(app))

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve())
    })

    const address = server.address() as AddressInfo
    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()))
    })
  })

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  async function postRun(body: unknown) {
    const response = await fetch(`${baseUrl}/api/run`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return {
      status: response.status,
      json: response.headers.get('content-type')?.includes('application/json')
        ? await response.json()
        : await response.text()
    }
  }

  it('returns 400 for missing code', async () => {
    const result = await postRun({})

    expect(result.status).toBe(400)
  })

  it('returns 400 for whitespace-only code', async () => {
    const result = await postRun({ code: '   ' })

    expect(result.status).toBe(400)
  })

  it('returns success when execution is stubbed to success', async () => {
    vi.spyOn(runMock, 'executeRunMock').mockResolvedValue({
      status: 'success',
      output: runMock.RUN_MOCK_SUCCESS_OUTPUT
    })

    const result = await postRun({ code: 'console.log("hi")' })

    expect(result.status).toBe(200)
    expect(result.json).toEqual({
      status: 'success',
      output: runMock.RUN_MOCK_SUCCESS_OUTPUT
    })
  })

  it('returns error when execution is stubbed to failure', async () => {
    vi.spyOn(runMock, 'executeRunMock').mockResolvedValue({
      status: 'error',
      message: runMock.RUN_MOCK_ERROR_MESSAGE
    })

    const result = await postRun({ code: 'throw new Error("boom")' })

    expect(result.status).toBe(200)
    expect(result.json).toEqual({
      status: 'error',
      message: runMock.RUN_MOCK_ERROR_MESSAGE
    })
  })
})
