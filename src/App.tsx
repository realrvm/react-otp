import { useState } from "react";
import { Otp } from "./components";

function App() {
  const [otp, setOtp] = useState("");

  return (
    <div className="app">
      <Otp value={otp} onChange={(value) => setOtp(value)} />
    </div>
  );
}

export default App;
