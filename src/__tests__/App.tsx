import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from 'App'
import renderWithProviders from 'testUtils'

describe('<App />', () => {
  it('renders', async () => {
    window.history.pushState({}, 'Home', '/')
    renderWithProviders(<App />, false)

    expect(screen.getByText('Loading')).toBeInTheDocument()
    await expect(screen.findByText('Archly')).resolves.toBeInTheDocument()
    await userEvent.click(screen.getByText('Sites'))

    // expect(screen.getByText('Sites')).toBeInTheDocument()
    // await expect(
    //   screen.findByText('Vitamins per 100 g (3.5 oz)')
    // ).resolves.toBeInTheDocument()
  })
})
