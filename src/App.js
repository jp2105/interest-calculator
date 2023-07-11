import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './Routing/AuthContext';
import ProtectedRoute from './Routing/ProtectedRoute';
import Home from './Pages/Home';
import Login from './Pages/Login'
import RandomChoice from './Pages/RandomChoice';
function App(pros) {
  return (
    <Router>
    <AuthProvider>
      <Switch>
        <ProtectedRoute exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact part="/random" component={RandomChoice}/>
      </Switch>
    </AuthProvider>
  </Router>
  );
}

export default App;
