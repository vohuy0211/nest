import './app.css';

import { BrowserRouter } from 'react-router-dom';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import Router from './Routes/Router';

function App() {
  const idPaypal = "AeOCRJcdTSKY25DvR8P2VAEN5v9lhONjSjiBPChbtSAJbxIMnmLp-HAUR0MfiRF0apcuS4j-BfKe3rVv"
  return (
    <PayPalScriptProvider options={{ clientId: idPaypal }}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
