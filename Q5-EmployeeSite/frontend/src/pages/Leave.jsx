import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Leave() {

    const [date, setDate] = useState("");
    const [reason, setReason] = useState("");
    const [grant, setGrant] = useState("No");

    const [leaves, setLeaves] = useState([]);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");


    // =====================================
    // GET LEAVES
    // =====================================

    const loadLeaves = async () => {

        try {

            const response = await fetch(
                "http://localhost:3004/api/leaves",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setLeaves(data);

        } catch (error) {

            setError("Unable to load leaves.");
        }
    };


    useEffect(() => {

        loadLeaves();

    }, []);


    // =====================================
    // ADD LEAVE
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await fetch(
                "http://localhost:3004/api/leaves",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        date,
                        reason,
                        grant
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage(
                "Leave application added successfully."
            );

            setDate("");
            setReason("");
            setGrant("No");

            loadLeaves();

        } catch (error) {

            setError("Unable to add leave.");
        }
    };


    return (
        <div className="container">

            <h1>Application for Leave</h1>


            {/* ADD LEAVE */}

            <div className="card">

                <h2>Add Leave</h2>

                <form onSubmit={handleSubmit}>

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                        required
                    />


                    <label>
                        Reason
                    </label>

                    <textarea
                        value={reason}
                        onChange={(e) =>
                            setReason(e.target.value)
                        }
                        placeholder="Enter reason"
                        required
                    />


                    <label>
                        Grant
                    </label>

                    <select
                        value={grant}
                        onChange={(e) =>
                            setGrant(e.target.value)
                        }
                    >
                        <option value="Yes">
                            Yes
                        </option>

                        <option value="No">
                            No
                        </option>

                    </select>


                    <button type="submit">
                        Add Leave
                    </button>

                </form>

                {message && (
                    <p className="success">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

            </div>


            {/* LIST LEAVE */}

            <div className="card">

                <h2>Leave List</h2>

                <table>

                    <thead>

                        <tr>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Grant</th>
                        </tr>

                    </thead>

                    <tbody>

                        {leaves.length === 0 ? (

                            <tr>
                                <td colSpan="3">
                                    No leave applications found.
                                </td>
                            </tr>

                        ) : (

                            leaves.map((leave) => (

                                <tr key={leave._id}>

                                    <td>
                                        {new Date(
                                            leave.date
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        {leave.reason}
                                    </td>

                                    <td>
                                        {leave.grant}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            <Link to="/">
                Back Home
            </Link>

        </div>
    );
}

export default Leave;