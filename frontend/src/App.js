import React from "react"

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"

import Homepage from "./views/Homepage"
import Loginpage from "./views/Loginpage"
import Registerpage from "./views/Registerpage"
import Dashboard from "./views/Dashboard"
import Navbar from "./views/Navbar"
import Footer from "./views/Footer"
import Message from './views/Message'
import MessageDetail from './views/MessageDetail'
import SearchUsers from "./views/SearchUsers"
 


function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar/>
        <Switch>
          <PrivateRoute component={Dashboard} path="/dashboard" exact/>
          <PrivateRoute component={Message} path="/inbox/" exact/>
          <PrivateRoute component={MessageDetail} path="/inbox/:id" exact/>
          <PrivateRoute component={SearchUsers} path="/search/:username" exact/>
          <Route component={Loginpage} path="/login" />
          <Route component={Registerpage} path="/register" exact />
          <Route component={Homepage} path="/" exact />
        </Switch>
        <Footer/>
      </AuthProvider>
    </Router>
  );
}

export default App;
