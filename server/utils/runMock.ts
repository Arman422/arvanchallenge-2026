export const RUN_MOCK_SUCCESS_OUTPUT = 'Hello World'
export const RUN_MOCK_ERROR_MESSAGE = 'Simulated execution failed'

export type RunMockSuccess = {
  status: 'success'
  output: string
}

export type RunMockError = {
  status: 'error'
  message: string
}

export type RunMockResult = RunMockSuccess | RunMockError

export type RunMockOptions = {
  delay?: (ms: number) => Promise<void>
  random?: () => number
}

const MIN_DELAY_MS = 1000
const MAX_DELAY_MS = 2000
const SUCCESS_THRESHOLD = 0.8

function defaultDelay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export function parseRunCode(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('code' in body)) {
    return null
  }

  const { code } = body as { code?: unknown }

  if (typeof code !== 'string' || code.trim().length === 0) {
    return null
  }

  return code
}

export async function executeRunMock(
  _code: string,
  options: RunMockOptions = {}
): Promise<RunMockResult> {
  const delay = options.delay ?? defaultDelay
  const random = options.random ?? Math.random

  const delayMs = MIN_DELAY_MS + Math.floor(random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1))
  await delay(delayMs)

  if (random() < SUCCESS_THRESHOLD) {
    return {
      status: 'success',
      output: RUN_MOCK_SUCCESS_OUTPUT
    }
  }

  return {
    status: 'error',
    message: RUN_MOCK_ERROR_MESSAGE
  }
}
