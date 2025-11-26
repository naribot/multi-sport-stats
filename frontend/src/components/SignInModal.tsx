import { useState } from "react";
import './SoccerPage.css';

export default function SignInModal({ onClose, onSignIn }: { onClose: () => void; onSignIn: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (username.trim() && password) {
      localStorage.setItem("user", username.trim());
      onSignIn(username.trim());
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="modal-actions">
          <button className="sign-in" onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
