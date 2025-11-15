import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ThemeContextProvider from '@context/ThemeContext';
import NotificationContainer from '@components/common/NotificationContainer';
import AppRoutes from '@/routes/AppRoutes';
import { store } from '@store/store';
import '@styles/globals.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <Router>
          <NotificationContainer />
          <AppRoutes />
        </Router>
      </ThemeContextProvider>
    </Provider>
  );
}

export default App;
