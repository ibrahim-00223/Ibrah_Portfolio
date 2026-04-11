import { createHashRouter, RouterProvider } from 'react-router-dom'
import { NavBar } from './components/layout/NavBar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero/Hero'
import { About } from './components/sections/About/About'
import { Projects } from './components/sections/Projects/Projects'
import { Stack } from './components/sections/Stack/Stack'
import { Contact } from './components/sections/Contact/Contact'
import { ProjectDetailPage } from './components/pages/ProjectDetailPage'

function MainLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Contact />
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
  { path: '/',             element: <MainLayout />   },
  { path: '/projets/:id',  element: <ProjectLayout /> },
])

export function App() {
  return <RouterProvider router={router} />
}
