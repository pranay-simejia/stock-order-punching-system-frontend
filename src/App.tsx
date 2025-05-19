import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import PlayGame from './pages/PlayGame';
import Transactions from './pages/Transactions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/client" element={<PlayGame />} />
          <Route path="/transactions" element={<Transactions />} />

      </Routes>
    </Router>
  );
}

export default App;