import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginPage from './pages/login.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from './contexts/auth-context.tsx';
import Workflow from './pages/workflow.tsx';
import WorkflowsGroup from './pages/workflows-group.tsx';
import Logs from './pages/logs.tsx';
import Admin from './pages/admin.tsx';

const router = createBrowserRouter([
  {
    path: "/workflows-group",
    element: <WorkflowsGroup />,
  },
  {
    path: "/",
    element: <WorkflowsGroup />,
  },
  {
    path: "/workflow",
    element: <Workflow />,
  },
  {
    path: "/logs",
    element: <Logs />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <Admin />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
