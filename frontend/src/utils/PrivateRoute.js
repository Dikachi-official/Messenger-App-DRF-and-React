import {Route, Redirect} from "react-router-dom"
import {useContext} from "react"
import AuthContext from "../context/AuthContext"

// FUNC TO HANDLE PRIVATE ROUTE(LIKE DASHBOARD) THAT REQUIRES AUTHENTICATION
const PrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext)
    return <Route {...rest}>{!user ? <Redirect to="/login" /> : children}</Route>  //if not user(authenticated), redirect to login. else, pass all props to {children} component
}

export default PrivateRoute



/*===  DELETE
//app.css
//app.test.js
//logo.svg
//setupTest.js
//reportWeb
===*/