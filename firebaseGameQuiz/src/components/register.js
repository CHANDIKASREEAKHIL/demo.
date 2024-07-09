import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./mainPage.css";
import DynamicForm from "./DynamicForm/dynamicForm";
import Header from "./header/Header";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDob] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);


  const handleRegister = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          dateOfBirth: dob,
          photo:""
        });
      }
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      toast.error("The email address is already registered with us", {
        position: "top-center",
      });
    } finally {
      setIsDisabled(false); 
    }
  };

  const formProps = {
    inputKeys: ["firstName", "lastName", "email", "password", "dob"],
    labels: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      password: "Password",
      dob: "Date of Birth",
    },
    inputTypes: {
      firstName: "text",
      lastName: "text",
      email: "text",
      password: "password",
      dob: "date",

    },
    values: {
      firstName: fname,
      lastName: lname,
      email: email,
      password: password,
      dob: dob,
    },
    columns: 1,
    inputWidth: 100,
    onChangeHandlers: {
      firstName: (value) => setFname(value),
      lastName: (value) => setLname(value),
      email: (value) => setEmail(value),
      password: (value) => setPassword(value),
      dob: (value) => setDob(value),
    },
    placeholders: {
      firstName: "Enter First Name",
      lastName: "Enter Last Name",
      email: "Enter email",
      password: "Enter password",
    },
    validationRules: {}, 
  };

  return (
    <div className="mainDiv">
      <Header />
      <div className="innerGrid">
      <div className="leftSection" style={{gridTemplateRows:"min-content", marginTop:"0vh"}}>
        <div style={{border: "2px solid #ac7474", padding:"5vh", width:"80%"}}>
      <form onSubmit={handleRegister}>
        <h3> Register </h3>
      <DynamicForm {...formProps}/>
      <div style={{display:"flex", justifyContent:"space-between", margin:"3vh 2vw 0vh 2vw"}}>
      <p className="forgot-password text-right">
        Already registered? Then <a style={{color:"white", fontWeight:"900", textDecoration: "none"}} href="/login">Login</a>
      </p>
        <button className="submitButton" type="submit" disabled={isDisabled}>
                  {isDisabled ? 'Signing Up...' : 'Sign Up'}
                </button>
      </div>
    </form>
    </div>
      </div>
      <div className="rightSection">

      </div>
      </div>
    </div>
  );
}
export default Register;
