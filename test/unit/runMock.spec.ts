import { describe, expect, it, vi } from 'vitest'
import {
  executeRunMock,
  parseRunCode,
  RUN_MOCK_ERROR_MESSAGE,
  RUN_MOCK_SUCCESS_OUTPUT
} from '../../server/utils/runMock'

describe('parseRunCode', () => {
  it('rejects missing code', () => {
    expect(parseRunCode(undefined)).toBeNull()
    expect(parseRunCode({})).toBeNull()
  })

  it('rejects empty or whitespace-only code', () => {
    expect(parseRunCode({ code: '' })).toBeNull()
    expect(parseRunCode({ code: '   \n\t  ' })).toBeNull()
  })

  it('accepts non-empty code', () => {
    expect(parseRunCode({ code: 'console.log("hi")' })).toBe('console.log("hi")')
  })
})

describe('executeRunMock', () => {
  it('returns success when randomness is stubbed to success', async () => {
    const delay = vi.fn(async () => {})
    const random = vi
      .fn()
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.1)

    const result = await executeRunMock('console.log("hi")', { delay, random })

    expect(result).toEqual({
      status: 'success',
      output: RUN_MOCK_SUCCESS_OUTPUT
    })
    expect(delay).toHaveBeenCalledWith(1000)
  })

  it('returns error when randomness is stubbed to failure', async () => {
    const delay = vi.fn(async () => {})
    const random = vi
      .fn()
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.95)

    const result = await executeRunMock('console.log("hi")', { delay, random })

    expect(result).toEqual({
      status: 'error',
      message: RUN_MOCK_ERROR_MESSAGE
    })
    expect(delay).toHaveBeenCalledWith(1500)
  })
})
