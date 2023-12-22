import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useHistory} from "react-router-dom"


const swal = require('sweetalert2')
const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    

    /*=== TO GET TOKEN AND DECODE THE GOTTEN REFRESH TOKEN CALLED "authTokens", IF THERE ISN'T THE NULL====*/
    const [user, setUser] = useState(() => 
        localStorage.getItem("authTokens")
            ? jwt_decode(localStorage.getItem("authTokens"))
            : null
    );


    /*=== LOADING PERIOD ===*/
    const [loading, setLoading] = useState(true);


    /*=== REDIRECT USER TO A SPECIFIC PAGE AFTER USER LOGIN ===*/
    const history = useHistory();


    /*=== A LOGIN USER FUNCTION TO LOGIN USER WITH EMAIL AND PASSWORD ===*/
    const loginUser = async (email, password) => {

        /*=== CALLING OUR BACKEND API USING JS FETCH METHOD TO THE LOGIN URL ROUTE ===*/
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });

        const data = await response.json()
        console.log(data);

        /*=== IF LOGIN DETAILS ARE LEGIT, LOGIN USER ===*/
        if(response.status === 200){
            console.log("Logged In");
            setAuthTokens(data)  /*=== COLLECT LOGGED IN USER REFRESH AND ACCESS TOKEN AND STORE IN "setAuthToken" WHICH STORES IN LOCAL STORAGE ===*/
            setUser(jwt_decode(data.access)) /*=== SET THE ACCESS TOKEN TO USER FROM THE COLLLECTED TOKEN PAIR ABOVE ===*/
            localStorage.setItem("authTokens", JSON.stringify(data)) /*== SET THOSE TOKEN PAIRS TO THE LOCAL STORAGE ==*/
            history.push("/") /*=== REDIRECT TO HOME PAGE ===*/
            //SWEET ALERT CODE 
            swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } else {    
            console.log(response.status);
            console.log("there was a server issue");
            alert("Something went wrong" + response.status)
            //SWEET ALERT CODE 
            swal.fire({
                title: "Username or password doesn't exist",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }




    /*=== A REGISTER USER FUNCTION TO REGISTER ===*/
    const registerUser = async (email, username, password, password2) => {

        /*=== CALLING OUR BACKEND API USING JS FETCH METHOD TO THE REGISTER URL ROUTE ===*/
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })


        if(response.status === 201){
            history.push("/login")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }




    /*=== A LOGOUT USER FUNCTION ===*/
    const logoutUser = () => {
        setAuthTokens(null) /*=== CLEAR OUT USER TOKEN ===*/
        setUser(null)  /*=== CLEAR OUT USER ===*/
        localStorage.removeItem("authTokens")
        history.push("/login")    /*=== REDIRECT USER TO LOGIN PAGE AFTER LOGOUT ===*/
        swal.fire({
            title: "YOu have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }



    /*=== CONTEXT DATA ===*/
    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    }



    /*=== TO USE USE-EFFECT HOOK TO CHECK FOR "AUTH-TOKEN" AND PASS IN AUTH CONTEXT DATAT===*/
    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access))  /*=== ACCESS TOKEN AUTHENTICATION TOKEN===*/
        }
        setLoading(false)
    }, [authTokens, loading])   

    

    return (       /*=== RETURN VALUE FOR THE MAIN FUNCTION CALLED "AuthProvider" ===*/
        <AuthContext.Provider value={contextData}>  
            {loading ? null : children} 
        </AuthContext.Provider>
    )

}

/*=== IF LOADING LET IT REMAIN NULL AND AFTER LOADING KICKSTART THE "children" WHICH IS ALL THE CODE WITHIN THE MAIN FUNCTION "AuthProvider" ===*/
/*=== ALL THESE IS TO GET THE CONTEXT-DATA USING THE "AuthProvider" MAIN FUNCTION ===*/