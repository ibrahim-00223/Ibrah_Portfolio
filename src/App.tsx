import { createHashRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { NavBar } from './components/layout/NavBar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero/Hero'
import { About } from './components/sections/About/About'
import { Projects } from './components/sections/Projects/Projects'
import { Stack } from './components/sections/Stack/Stack'
import { ProjectDetailPage } from './components/pages/ProjectDetailPage'
import { NotFoundPage } from './components/pages/NotFoundPage'
import { AdminPage } from './components/pages/AdminPage'

function MainLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Projects />
        <Stack />
        <About />
      </main>
      <Footer />
    </>
  )
}

function ProjectLayout() {
  return (
    <>
      <NavBar />
      <ProjectDetailPage />
      <Footer />
    </>
  )
}

const router = createHashRouter([
  { path: '/',             element: <MainLayout />    },
  { path: '/projets/:id',  element: <ProjectLayout /> },
  { path: '/admin',        element: <AdminPage />     },
  { path: '*',             element: <NotFoundPage />  },
])

export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
