import { ThemeProvider } from "styled-components"
import theme from '@/styles/theme';
import GlobalStyles from '@/styles/global';
import { routes } from "./routes"
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { Toaster } from "react-hot-toast";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '@/styles/react-big-calendar.css';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />

      <AuthProvider>
        <DataProvider>
          <RouterProvider router={routes} />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
