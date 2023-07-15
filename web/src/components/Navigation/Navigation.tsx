import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const Sidebar = () => {
  const { isAuthenticated, currentUser, logOut } = useAuth()

  return (
    <nav>
      <ul>
        <li>
          <Link to={routes.home()}>Home</Link>
        </li>
        <li>
          {isAuthenticated ? (
            <div>
              <span>Logged in as {JSON.stringify(currentUser)}</span>{' '}
              <button type="button" onClick={logOut}>
                Logout
              </button>
            </div>
          ) : (
            <Link to={routes.login()}>Login</Link>
          )}{' '}
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar
