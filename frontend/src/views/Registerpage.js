import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom"
import AuthContext from '../context/AuthContext'
import banking from '../img/banking.jpg'; // with import

function Registerpage() {


    const [email, setEmail] = useState("")  //"setEmail" is to get the input from frontend and "email" is variable holding it
    const [username, setUsername] = useState("")  //same as above
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
  
    const {registerUser} = useContext(AuthContext)
  
    console.log(email);
    console.log(username);
    console.log(password);
    console.log(password2);
  
  
    const handleSubmit = async e => {   //handleSubmiting of the form
      e.preventDefault()   //Preventpage refresh
      registerUser(email, username, password, password2)  //pass auth details to registeredusers
    }




    return (
        <div>
            <div style={{ margin: "50px 0px" }} />
            <section className="vh-100%" style={{ backgroundColor: "grey", marginTop: "8%" }}>
                <div className="container py-5 ">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col col-xl-10">
                    <div className="card" style={{ borderRadius: "1rem" }}>
                        <div className="row g-0">
                        <div className="col-md-6 col-lg-5 d-none d-md-block">
                            <img src={banking} alt="login form" className="img-fluid"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1rem 0 0 1rem" }}/>
                        </div>
                        <div className="col-md-6 col-lg-7 d-flex align-items-center">
                            <div className="card-body p-4 p-lg-5 text-black">
                            <form onSubmit={handleSubmit}>  {/*onsubmmit of this form, it should run the "handlesubmit" code at the top*/}
                                <div className="d-flex align-items-center mb-3 pb-1">
                                <i
                                    className="fas fa-cubes fa-2x me-3"
                                    style={{ color: "#ff6219" }}
                                />
                                <span className="h2 fw-bold mb-0">
                                    Welcome to <b>Mikes👋</b>
                                </span>
                                </div>
                                <h5
                                className="fw-normal mb-3 pb-3"
                                style={{ letterSpacing: 1 }}
                                >
                                Sign Up
                                </h5>
                                <div className="form-outline mb-4">
                                <input type="email" id="form2Example17" className="form-control form-control-lg" placeholder="Email Address"
                                    onChange={e => setEmail(e.target.value)}/>  {/*Any input in here automatically goes to "useState" above */}
                                </div>
                                <div className="form-outline mb-4">
                                <input type="text" id="form2Example17" className="form-control form-control-lg" placeholder="Username"
                                    onChange={e => setUsername(e.target.value)}/>
                                </div>
                                <div className="form-outline mb-4">
                                <input type="password" id="form2Example17" className="form-control form-control-lg" placeholder="Password"
                                    onChange={e => setPassword(e.target.value)}/>
                                </div>
                                <div className="form-outline mb-4">
                                <input type="password" id="form2Example27" className="form-control form-control-lg" placeholder="Confirm Password"
                                    onChange={e => setPassword2(e.target.value)}/>
                                </div>
                                <div className="pt-1 mb-4">
                                <button className="btn btn-dark btn-lg btn-block" type="submit">
                                    Register
                                </button>
                                </div>
                                <a className="small text-muted" href="#!">
                                Forgot password?
                                </a>
                                <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                                Already have an account?{" "}
                                <Link to="/login" style={{ color: "#393f81" }}>
                                    Login Now
                                </Link>
                                </p>
                                <a href="#!" className="small text-muted">
                                Terms of use.
                                </a>
                                <a href="#!" className="small text-muted">
                                Privacy policy
                                </a>
                            </form>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        </div>
    )
}

export default Registerpage