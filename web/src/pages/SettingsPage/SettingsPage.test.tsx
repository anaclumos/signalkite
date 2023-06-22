import { render } from '@redwoodjs/testing/web'

import SettingsPage from './SettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SettingsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SettingsPage />)
    }).not.toThrow()
  })
})
