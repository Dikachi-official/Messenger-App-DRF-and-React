import React from 'react'
import './style/Message.css'
import { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import jwtDecode from 'jwt-decode'
import { Link, useParams, useHistory } from 'react-router-dom/'
import moment from 'moment';



function MessageDetail() {

  const baseURL = 'http://127.0.0.1:8000/api'

  const [messages, setMessages] = useState([])  //ALL MESSAGES NEWSTATE (useEffect)
  const [message, setMessage] = useState([])  //INDIVIDUAL NEWSTATE (useEffect)

  // To define state for send messages
  let [newMessage, setNewMessage] = useState({message : ""})

  // To define state for Search user
  let [newSearch, setNewSearch] = useState({search : ""})

  const receiver_id = useParams()

  // Initialize the useAxios Function to post and get data from protected routes
  const axios = useAxios()

  // Get and Decode Token
  const token = localStorage.getItem('authTokens');
  const decoded = jwtDecode(token)

  // Get Userdata from decoded token
  const user_id = decoded.user_id

  // Initialize useHistory to redirect users
  const history = useHistory()



  //ALL MESSAGES NEWSTATE (useEffect) 
  useEffect(() => {
    try {
      // Send a get request to the api endpoint to get the message of the logged in user
      axios.get(baseURL + '/my-messages/' + user_id + '/').then((res) => {
        // Set the data that was gotten back from the database via the api to the setMessage state
        setMessages(res.data)
        // Console Log the data that was gotten from the db
        console.log(res.data);
      })
    } catch (error) {
      console.log(error);
    }
  }, []) //dependency array, to let loop run only once


  //INDIVIDUAL NEWSTATE MSG (useEffect)
  useEffect(() => {
      let interval = setInterval(() => {
        try {
          axios.get(baseURL + '/get-messages/' + user_id + '/' + receiver_id.id + '/' ).then((res) => {
            console.log(res.data);
            setMessage(res.data)
          })
        } 
        catch (error) {
          console.log(error);
        }
      }, 1000) //get msg loop every 1sec
      return () => {
        clearInterval(interval)
      }
  }, [history, receiver_id.id])


  // capture changes made by the user in those fields and update the component's state accordingly.
  // grab user input at frontend and send to "setNewMessage" state 
  const handleChange = (event) => {
    setNewMessage({
      ...newMessage, //means a spread operator, to grab the value of "newMessage" key
      [event.target.name]: event.target.value,
    });
  };

  console.log(newMessage);



  // Send Message
  // get form data from user input frontend
  const SendMessage = () => {
    const formdata = new FormData()
    formdata.append("user", user_id)
    formdata.append("sender", user_id)
    formdata.append("receiver", receiver_id.id)
    formdata.append("message", newMessage.message)
    formdata.append("is_read", false)

    //send form data through API path "localhost/api/send-messages/" to the database 
    try {
        axios.post(baseURL + '/send-messages/', formdata).then((res) => {
          document.getElementById("text-input").value = ""; //to claer the user input field after msg send
          setNewMessage(newMessage = "")
        })
    } catch (error) {
        console.log("error ===", error);
    }

  }



  // Search User func
  const handleSearchChange = (event) => {
    setNewSearch({
      ...newSearch,
      [event.target.name]: event.target.value
    })
  }
  console.log(newSearch.username);

  const SearchUser = () => {
    try {
      axios.get(baseURL + '/search/' + newSearch.username + '/')
      .then((res) => {
          if (res.status === 404) {
              console.log(res.data.detail);
              alert("User does not exist");
          } else {
              history.push('/search/'+newSearch.username+'/');
              console.log("Found")
          }
      })
      .catch((error) => {
          alert("User Does Not Exist")
      });
    } 
    catch (error) {
      console.log(error);
    }
      
  }



  return (
    <div>
      <main className="content" style={{ marginTop: "150px" }}>
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
              <div className="px-4 ">
                  <div className="d-flfex align-itemfs-center">
                    <div className="flex-grow-1 d-flex align-items-center mt-2">
                      <input type="text" className="form-control my-3" placeholder="Search User..." onChange={handleSearchChange} name='username'/>
                      <button onClick={SearchUser} className='ml-2' style={{border:"none", borderRadius:"50%"}}><i className='fas fa-search'></i></button>
                    </div>
                  </div>
                </div>
                {messages.map((message) =>
                  <Link to={"/inbox/" + (message.sender.id === user_id ? message.receiver.id : message.sender.id) + "/"} 
                    href="#" className="list-group-item list-group-item-action border-0">
                    <small>
                      <div className="badge bg-success float-right text-white">
                        {moment.utc(message.date).local().startOf('seconds').fromNow()}
                      </div>
                    </small>
                    
                    {/*=== THE LEFT SIDE OF MSG DETAIL ===*/}
                    <div className="d-flex align-items-start">
                    {/*=== if message sender is not the logged in user === */}
                    {message.sender.id !== user_id && 
                      <img src={message.sender_profile.image} className="rounded-circle mr-1" alt="1" width={40} height={40}/>
                    }

                    {/*=== if message sender is the logged in user === */}
                    {message.sender.id === user_id && 
                      <img src={message.receiver_profile.image} className="rounded-circle mr-1" alt="2" width={40} height={40}/>
                    }
                      <div className="flex-grow-1 ml-3">
                          {message.sender.id === user_id && 
                            (message.receiver_profile.full_name !== null ? message.receiver_profile.full_name : message.receiver.username)
                          }

                          {message.sender.id !== user_id && 
                            (message.sender.username) 
                          }
                        <div className="small">
                           <small>{message.message}</small>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
                
                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>




              {/*=== THE RIGHT SIDE OF MSG DETAIL PAGE ===*/}
              <div className="col-12 col-lg-7 col-xl-9">
                {/*=== HEADER RIGHT SIDE ===*/}
                <div className="py-2 px-4 border-bottom d-none d-lg-block">
                  {message.map((message, index) =>
                    <>
                      {message.sender.id !== user_id &&
                        <div className="d-flex align-items-center py-1">
                          <div className="position-relative">
                            <img
                              src={message.sender_profile.image}
                              className="rounded-circle mr-1"
                              alt="Sharon Lessman"
                              width={40}
                              height={40} />
                          </div>
                          <div className="flex-grow-1 pl-3">
                            {message.sender.id !== user_id &&
                              <strong>{message.sender_profile.full_name}</strong>}
                            <div className="text-muted small">
                              <em>Online</em>
                            </div>
                          </div>
                          {/*=== HEADER BUTTONS ===*/}
                          <div>
                            <button className="btn btn-primary btn-lg mr-1 px-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-phone feather-lg"
                              >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                            </button>
                            <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-video feather-lg"
                              >
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                              </svg>
                            </button>
                            <button className="btn btn-light border btn-lg px-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-more-horizontal feather-lg"
                              >
                                <circle cx={12} cy={12} r={1} />
                                <circle cx={19} cy={12} r={1} />
                                <circle cx={5} cy={12} r={1} />
                              </svg>
                            </button>
                          </div>
                          {/*=== END OF HEADER BUTTONS ===*/}
                        </div>
                      }
                    </>
                  )}
                </div>
                {/*=== END OF HEADER RIGHT SIDE ===*/}

                <div className="position-relative">
                  <div className="chat-messages p-4">
                    {message.map((message, index) =>
                      <>
                        {message.sender === user_id &&
                          <div className="chat-message-right pb-4">
                            <div>
                              <img
                                src={message.sender_profile.image}
                                className="rounded-circle mr-1"
                                alt="Chris Wood"
                                width={40}
                                height={40}
                              />
                              <div className="text-muted small text-nowrap mt-2">
                                {moment.utc(message.date).local().startOf('seconds').fromNow()}
                              </div>
                            </div>
                            <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                              <div className="font-weight-bold mb-1">{message.sender_profile.full_name}</div>
                              {message.message}
                            </div>
                          </div>
                        }
                      
                    
                      
                        {message.sender !== user_id &&
                          <div className="chat-message-left pb-4">
                            <div>
                              <img
                                src={message.sender_profile.image}
                                className="rounded-circle mr-1"
                                alt="Sharon Lessman"
                                width={40}
                                height={40}
                              />
                              <div className="text-muted small text-nowrap mt-2">
                              {moment.utc(message.date).local().startOf('seconds').fromNow()}
                              </div>
                            </div>
                            <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                              <div className="font-weight-bold mb-1">{message.sender_profile.full_name}</div>
                              {message.message}
                            </div>
                          </div>
                        }
                      </>
                    )}

                  </div>
                </div>
                <div className="flex-grow-0 py-3 px-4 border-top">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message"
                      name='message'
                      value={newMessage.message}
                      onChange={handleChange}
                      id='text-input'
                    />
                    <button onClick={SendMessage} className="btn btn-primary">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MessageDetail