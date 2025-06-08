import { useState } from "react";

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Registration successful!");
            } else {
                alert("Registration failed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="bg-dark min-h-screen flex items-center justify-center text-light">
            <form
                className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-primary text-2xl mb-4">Register</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full p-2 mb-3 bg-dark text-light border border-gray-600 rounded"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 bg-dark text-light border border-gray-600 rounded"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 mb-3 bg-dark text-light border border-gray-600 rounded"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="bg-primary hover:bg-purple-700 p-2 w-full rounded"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
