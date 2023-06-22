import { render } from '@redwoodjs/testing/web'

import FallbackPage from './FallbackPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('FallbackPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FallbackPage />)
    }).not.toThrow()
  })
})
