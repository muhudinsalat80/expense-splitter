import React, { useState } from "react";
import "./App.css";

function App() {
  // State variables
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [budget, setBudget] = useState(0);
  const [contributions, setContributions] = useState({});

  // Add member (normal function)
  function addMember() {
    let name = memberName.trim();

    if (name === "") {
      return;
    }

    // Make a new array manually (instead of [...members])
    let newMembers = [];
    for (let i = 0; i < members.length; i++) {
      newMembers.push(members[i]);
    }
    newMembers.push(name);

    setMembers(newMembers);

    // Make a new object manually (instead of {...contributions, [name]: 0})
    var newContributions = {};
    for (let key in contributions) {
      newContributions[key] = contributions[key];
    }
    newContributions[name] = 0;

    setContributions(newContributions);

    // Clear input
    setMemberName("");
  }

  // Update contribution (normal function)
  function updateContribution(name, value) {
    var amount = Number(value);

    // Copy old object into new one
    let newContributions = {};
    for (let key in contributions) {
      newContributions[key] = contributions[key];
    }

    // Update specific member amount
    newContributions[name] = amount;

    setContributions(newContributions);
  }

  // Calculate total contribution (normal loop)
  let totalContributed = 0;
  for (let person in contributions) {
    totalContributed = totalContributed + contributions[person];
  }

  // Calculate share per person
  let share = 0;
  if (members.length > 0) {
    share = budget / members.length;
  }

  // Build member list UI 
  let memberListItems = [];
  for (let x = 0; x < members.length; x++) {
    memberListItems.push(<li key={x}>{members[x]}</li>);
  }

  // Build contribution inputs UI 
  let contributionInputs = [];
  for (let y = 0; y < members.length; y++) {
    let personName = members[y];

    contributionInputs.push(
      <div key={y} style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>{personName}:</label>
        <input
          type="number"
          value={contributions[personName] || 0}
          onChange={function (e) {
            // This fixes the beginner "loop variable" problem
            updateContribution(personName, e.target.value);
          }}
        />
      </div>
    );
  }

  // Build who owes list UI without map()
  let owesList = [];
  for (let z = 0; z < members.length; z++) {
    let pName = members[z];
    let paid = contributions[pName] || 0;
    let owes = share - paid;

    let message = "";

    if (owes > 0) {
      message = "Owes Ksh " + owes.toFixed(2);
    } else {
      message = "✅ OK";
    }

    owesList.push(
      <li key={z}>
        {pName} paid Ksh {paid} → <b>{message}</b>
      </li>
    );
  }

  return (
    <div className="App">
      <h1>Simple Expense Sharing App</h1>

      <h2>Add Members</h2>
      <input
        type="text"
        value={memberName}
        placeholder="Enter name"
        onChange={function (e) {
          setMemberName(e.target.value);
        }}
      />
      <button onClick={addMember}>Add</button>

      <ul>{memberListItems}</ul>

      <h2>Enter Budget</h2>
      <input
        type="number"
        value={budget}
        onChange={function (e) {
          setBudget(Number(e.target.value));
        }}
      />
      <p>
        <b>Budget:</b> Ksh {budget}
      </p>

      <h2>Enter Contributions</h2>
      {contributionInputs}

      <hr />

      <h2>Summary</h2>
      <p>
        <b>Total Contributed:</b> Ksh {totalContributed}
      </p>
      <p>
        <b>Each Person Should Pay:</b> Ksh {share.toFixed(2)}
      </p>

      <h3>Who Owes Money?</h3>
      <ul>{owesList}</ul>
    </div>
  );
}

export default App;







