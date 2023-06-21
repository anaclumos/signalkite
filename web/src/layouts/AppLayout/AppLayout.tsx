import Navigation from 'src/components/Navigation/Navigation'
import Seo from 'src/components/Seo/Seo'

type AppLayoutProps = {
  children?: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Seo />
      <Navigation />
      {children}
    </>
  )
}

export default AppLayout
