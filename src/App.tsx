import { AppContextProvider } from './contexts/AppContext';
import { AppContent } from './AppContent';
import './index.css';

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
