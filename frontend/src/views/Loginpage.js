import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import AuthContext from '../context/AuthContext'
import banking from "../img/banking.jpg"



function Loginpage() {


    const { loginUser } = useContext(AuthContext)
    const handleSubmit = e => {
        e.preventDefault()
        const email = e.target.email.value   //GET THE EMAIL FROM FRONTEND INPUT FROM(AUTHCONTEXT)
        const password = e.target.password.value  //GET THE PASSWORD FROM FRONTEND INPUT FROM(AUTHCONTEXT)

        email.length > 0 && loginUser(email, password)  //IF EMAIL LENGTH IS > 0, THEN LOGIN USER

        console.log(email)
        console.log(password)
        
    }


    return (
        <div>
            <section className="" style={{ backgroundColor: "grey", marginTop: "8%" }}>
                <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                    <div className="card" style={{ borderRadius: "1rem" }}>
                        <div className="row g-0">
                        <div className="col-md-6 col-lg-5 d-none d-md-block">
                            <img src={banking} alt="login form" className="img-fluid"
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1rem 0 0 1rem" }}/>
                        </div>
                        <div className="col-md-6 col-lg-7 d-flex align-items-center">
                            <div className="card-body p-4 p-lg-5 text-black">
                            <form onSubmit={handleSubmit}> {/*onsubmmit of this form, it should run the "handlesubmit" code at the top*/}
                                <div className="d-flex align-items-center mb-3 pb-1">
                                <i
                                    className="fas fa-cubes fa-2x me-3"
                                    style={{ color: "#ff6219" }}
                                />
                                <div className="d-flex align-items-center mb-3 pb-1">
                                    <i
                                    className="fas fa-cubes fa-2x me-3"
                                    style={{ color: "#ff6219" }}
                                    />
                                    <span className="h2 fw-bold mb-0">Welcome back 👋</span>
                                </div>
                                </div>
                                <h5
                                className="fw-normal mb-3 pb-3"
                                style={{ letterSpacing: 1 }}
                                >
                                Sign into your account
                                </h5>
                                <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="form2Example17"
                                    className="form-control form-control-lg"
                                    name="email"
                                />
                                <label className="form-label" htmlFor="form2Example17">
                                    Email address
                                </label>
                                </div>
                                <div className="form-outline mb-4">
                                <input
                                    type="password"
                                    id="form2Example27"
                                    className="form-control form-control-lg"
                                    name="password"
                                />
                                <label className="form-label" htmlFor="form2Example27">
                                    Password
                                </label>
                                </div>
                                <div className="pt-1 mb-4">
                                <button
                                    className="btn btn-dark btn-lg btn-block"
                                    type="submit"
                                >
                                    Login
                                </button>
                                </div>
                                <a className="small text-muted" href="#!">
                                Forgot password?
                                </a>
                                <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                                Don't have an account?{" "}
                                <Link to="/register" style={{ color: "#393f81" }}>
                                    Register Now
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

export default Loginpage