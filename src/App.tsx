import { BrowserRouter as Router, Route } from 'react-router-dom';

import Index from './pages/Index';

import SnackBar from 'components/SnackBar';
import ConfirmDialog from './components/ConfirmDialog';

import { StoreProvider } from './store';

const AppRouter = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="bg-[#181818] min-h-screen w-screen">
          <Route path="/" component={Index} />
          <SnackBar />
          <ConfirmDialog />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default AppRouter;
