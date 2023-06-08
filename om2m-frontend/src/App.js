import "./App.css";
import React from "react";
import axios from "axios";

function App() {
  const [data, setData] = React.useState({});
  const [ae, setAe] = React.useState("");
  const [node, setNode] = React.useState("");

  const handleSubmit = () => {
    axios
      .get(`http://localhost:4000/data/${ae}/${node}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        // If not 500 alert haiyaa, you messed up
        // else if 500, Uncle roger is disappointed in himself
        if (err.response.status === 500) {
          alert("Uncle roger is disappointed in himself");
        } else {
          alert("Haiyaa, you messed up");
        }
      });
  };

  return (
    <div className="App">
      <h1>Node Data</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <div>
          <label>AE: </label>
          <input
            type="text"
            value={ae}
            onChange={(e) => setAe(e.target.value)}
          />
        </div>
        <div>
          <label>Node: </label>
          <input
            type="text"
            value={node}
            onChange={(e) => setNode(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {Object.keys(data).length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Descriptor</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{data[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
