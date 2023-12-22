import React from "react"


function Footer(){

    return (
        <div>
            <footer className="bg-dark text-center text-lg-start" style={{ color: "white" }}>
                <div
                className="text-center p-3"
                style={{ backgroundColor: "black", color: "white" }}
                >
                © 2023 - till date Copyright:
                    <a className="text-dark" href="https://mdbootstrap.com/" style={{ color: "white" }}>
                        Mikes👋
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default Footer