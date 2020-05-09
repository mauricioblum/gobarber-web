import React from 'react';

import AuthContext from './context/AuthContext';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import GlobalStyle from './styles/global';

const App: React.FC = () => {
  return (
    <>
      <AuthContext.Provider value={{ name: 'Mau' }}>
        <SignIn />
      </AuthContext.Provider>
      <GlobalStyle />
    </>
  );
};

export default App;
