import Navigation from 'src/components/Navigation/Navigation'

type AppLayoutProps = {
  children?: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
}

export default AppLayout
