import React, { useState } from "react";
import "./App.css";

function App() {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [budget, setBudget] = useState(0);
  const [contributions, setContributions] = useState({});

  const addMember = () => {
    if (memberName.trim() === "") return;

    setMembers([...members, memberName]);

    setContributions({ ...contributions, [memberName]: 0 });

    setMemberName("");
  };

  const updateContribution = (name, value) => {
    setContributions({ ...contributions, [name]: Number(value) });
  };

  let totalContributed = 0;
  for (let name in contributions) {
    totalContributed = totalContributed + contributions[name];
  }

  let share = 0;
  if (members.length > 0) {
    share = budget / members.length;
  }

  return (
    <div className="App">
      <h1>Simple Expense Sharing App</h1>

      <h2>Add Members</h2>
      <input
        type="text"
        value={memberName}
        placeholder="Enter name"
        onChange={(e) => setMemberName(e.target.value)}
      />
      <button onClick={addMember}>Add</button>

      <ul>
        {members.map((m, index) => (
          <li key={index}>{m}</li>
        ))}
      </ul>

      <h2>Enter Budget</h2>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
      />
      <p><b>Budget:</b> Ksh {budget}</p>

      <h2>Enter Contributions</h2>

      {members.map((m, index) => (
        <div key={index}>
          <label>{m}:</label>
          <input
            type="number"
            value={contributions[m]}
            onChange={(e) => updateContribution(m, e.target.value)}
          />
        </div>
      ))}

      <hr />

      <h2>Summary</h2>
      <p><b>Total Contributed:</b> Ksh {totalContributed}</p>
      <p><b>Each Person Should Pay:</b> Ksh {share.toFixed(2)}</p>

      <h3>Who Owes Money?</h3>
      <ul>
        {members.map((m, index) => {
          const paid = contributions[m];
          const owes = share - paid;

          return (
            <li key={index}>
              {m} paid Ksh {paid} →{" "}
              {owes > 0 ? (
                <b style={{ color: "red" }}>
                  Owes Ksh {owes.toFixed(2)}
                </b>
              ) : (
                <b style={{ color: "green" }}>✅ OK</b>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;






