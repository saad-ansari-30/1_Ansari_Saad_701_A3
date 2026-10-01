import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [empId, setEmpId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response = await fetch(
                "http://localhost:3004/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        empId,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "employeeName",
                data.employee.name
            );

            navigate("/");

        } catch (error) {

            setError("Unable to connect to server.");
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h1>Employee Login</h1>

                <form onSubmit={handleLogin}>

                    <label>Employee ID</label>

                    <input
                        type="text"
                        placeholder="Enter Employee ID"
                        value={empId}
                        onChange={(e) =>
                            setEmpId(e.target.value)
                        }
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;