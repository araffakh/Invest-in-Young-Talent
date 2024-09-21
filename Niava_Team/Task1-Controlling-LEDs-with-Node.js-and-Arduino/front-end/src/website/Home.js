import "./homeStyle.css";
import axios from "axios";

export default function Home() {
  function handleLed(e) {
    axios
      .post("http://localhost:5000/api/led", {
        led: e.target.checked,
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="home">
      <div className="home-main">
        <h1 className="home-title">Web-Based LED Control System</h1>
        <div className="home-div">
          <h2 className="home-system-title">turn the led</h2>

          <label className="switch">
            <input type="checkbox" onClick={(e) => handleLed(e)} />
            <span className="slider" />
          </label>
        </div>
      </div>
    </div>
  );
}
