import { MainLayout } from '@/layouts';
import { HistoryPage, HomePage, SchedulesPage, SectorsPage, UserPage } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';

export const routes = createBrowserRouter([{
  element: <MainLayout />,
  children: [
    { path: '/', element: <HomePage /> },
    { path: '/sectors', element: <SectorsPage /> },
    { path: '/schedules', element: <SchedulesPage /> },
    { path: '/history', element: <HistoryPage /> },
    { path: '/user', element: <UserPage /> },
  ]
}])