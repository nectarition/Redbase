import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import IndexPage from './pages/IndexPage/IndexPage'
import ModalProvider from './providers/ModalProvider'

const Root: React.FC = () => {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        index: true,
        element: <IndexPage />
      }
    ]
  }
])

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </HelmetProvider>
  )
}

export default App
