import { Private, Route, Router, Set } from '@redwoodjs/router'

import AppLayout from 'src/layouts/AppLayout/AppLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={AppLayout}>
        <Private unauthenticated="fallback">
          <Route path="/settings" page={SettingsPage} name="settings" />
          <Route path="/settings/{locale:String}" page={SettingsPage} name="settings" />
          <Route path="/profile/" page={ProfilePage} name="profile" />
          <Route path="/profile/{locale:String}" page={ProfilePage} name="profile" />
        </Private>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/{locale:String}" page={HomePage} name="home" />
      </Set>
      <Route path="/fallback" page={FallbackPage} name="fallback" />
      <Route notfound page={NotFoundPage} prerender />
    </Router>
  )
}

export default Routes
