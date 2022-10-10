import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInUser } from "../../firebase";
import "../Styles.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };
    try {
      await signInUser(data);
      navigate("/Mulligan");
    } catch (error) {
      setError(true)
      console.log(error);
    }
  };

  return (
    <div className="register-container">
      <form action="" onSubmit={(e) => submitHandler(e)}>
        <input
          type="text"
          placeholder="email"
          className="text-input"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          className="text-input"
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="log-in" className="log-in-btn">
          Log In
        </label>
        <input type="submit" id="log-in" style={{ display: "none" }} />
        {error && <p style={{color: "red", textAlign: "center"}}>Email or password incorrect</p>}
        <p>
          Dont have an account yet? <Link to={"/register"}>Register Here</Link>{" "}
        </p>
      </form>
    </div>
  );
}

export default Login;
