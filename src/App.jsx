import { useContext } from "react";
import { Route, Routes, HashRouter, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="login"/>;
    }else{
     return children
    }
  };

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route exact path="/">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
