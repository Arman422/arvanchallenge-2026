export type RunMockSuccess = {
  status: 'success'
  output: string
}

export type RunMockError = {
  status: 'error'
  message: string
}

export type RunApiResponse = RunMockSuccess | RunMockError
