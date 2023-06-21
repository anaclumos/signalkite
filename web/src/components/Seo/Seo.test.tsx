import { render } from '@redwoodjs/testing/web'

import Seo from './Seo'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Seo', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Seo />)
    }).not.toThrow()
  })
})
