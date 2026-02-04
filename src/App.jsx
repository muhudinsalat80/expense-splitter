import React, { useState } from "react";
import "./App.css";

// ✅ Convert Ksh string/number to cents (integer)
const toCents = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
};

// ✅ Convert cents back to Ksh format
const formatKsh = (cents) => {
  return `Ksh ${(cents / 100).toFixed(2)}`;
};

function App() {
  // ================== MEMBERS ==================
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");

  // ================== BUDGET ==================
  const [budget, setBudget] = useState(""); // user input (string)

  // ================== CONTRIBUTIONS ==================
  const [contributions, setContributions] = useState({});

  // ================== SUMMARY ==================
  const [showSummary, setShowSummary] = useState(false);

  // ================== ADD MEMBER ==================
  const addMember = () => {
    const name = memberName.trim();

    if (!name || members.includes(name)) return;

    setMembers([...members, name]);
    setContributions({ ...contributions, [name]: 0 });
    setMemberName("");
  };

  // ================== UPDATE CONTRIBUTION ==================
  const handleContributionChange = (member, value) => {
    setContributions({
      ...contributions,
      [member]: toCents(value),
    });
  };

  // ================== MONEY CALCULATIONS IN CENTS ==================
  const budgetCents = toCents(budget);

  const totalContributedCents = Object.values(contributions).reduce(
    (sum, v) => sum + v,
    0
  );

  // fair share per person (in cents)
  const shareCents = members.length
    ? Math.round(budgetCents / members.length)
    : 0;

  // balances array
  const balances = members.map((member) => {
    const paid = contributions[member] || 0;
    const balance = paid - shareCents;
    return { member, paid, balance };
  });

  // ================== WHO PAYS WHO (SETTLEMENT ALGORITHM) ==================
  const generateSettlement = () => {
    // creditors = people with positive balance (receive)
    let creditors = balances
      .filter((b) => b.balance > 0)
      .map((b) => ({ ...b }));

    // debtors = people with negative balance (owe)
    let debtors = balances
      .filter((b) => b.balance < 0)
      .map((b) => ({ ...b }));

    // sort just to keep output stable
    creditors.sort((a, b) => b.balance - a.balance);
    debtors.sort((a, b) => a.balance - b.balance);

    const transactions = [];

    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amountToPay = Math.min(-debtor.balance, creditor.balance);

      if (amountToPay > 0) {
        transactions.push({
          from: debtor.member,
          to: creditor.member,
          amount: amountToPay,
        });

        // update balances
        debtor.balance += amountToPay;
        creditor.balance -= amountToPay;
      }

      // move next debtor if settled
      if (debtor.balance === 0) i++;

      // move next creditor if settled
      if (creditor.balance === 0) j++;
    }

    return transactions;
  };

  const settlementTransactions = showSummary ? generateSettlement() : [];

  // ================== BUTTONS ==================
  const generateSummary = () => setShowSummary(true);

  const resetAll = () => {
    setMembers([]);
    setMemberName("");
    setBudget("");
    setContributions({});
    setShowSummary(false);
  };

  // ================== RENDER ==================
  return (
    <div className="App">
      <h1>Expense Sharing App (Kenya Shillings)</h1>

      {/* ========== ADD MEMBERS ========== */}
      <div>
        <h2>Add Group Members</h2>
        <input
          type="text"
          placeholder="Enter member name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        />
        <button onClick={addMember}>Add Member</button>

        <ul>
          {members.map((m, idx) => (
            <li key={idx}>{m}</li>
          ))}
        </ul>
      </div>

      {/* ========== SET BUDGET ========== */}
      <div>
        <h2>Set Group Budget</h2>
        <input
          type="number"
          placeholder="Example: 12000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <p>
          Budget: <strong>{formatKsh(budgetCents)}</strong>
        </p>
      </div>

      {/* ========== ENTER CONTRIBUTIONS ========== */}
      <div>
        <h2>Enter Contributions</h2>

        {members.length === 0 ? (
          <p>⚠️ Add members first.</p>
        ) : (
          members.map((member, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <label style={{ marginRight: "10px" }}>
                <strong>{member}</strong>:
              </label>
              <input
                type="number"
                placeholder="Contribution"
                onChange={(e) =>
                  handleContributionChange(member, e.target.value)
                }
              />
            </div>
          ))
        )}

        <p>
          Total Contributed:{" "}
          <strong>{formatKsh(totalContributedCents)}</strong>
        </p>

        <button onClick={generateSummary}>Generate Summary</button>
        <button onClick={resetAll} style={{ marginLeft: "10px" }}>
          Reset All
        </button>
      </div>

      {/* ========== SUMMARY ========== */}
      {showSummary && (
        <div>
          <h2>Settlement Summary</h2>

          <p>
            Group Budget: <strong>{formatKsh(budgetCents)}</strong>
          </p>
          <p>
            Each Person Share: <strong>{formatKsh(shareCents)}</strong>
          </p>

          <hr />

          <h3>✅ Contributions</h3>
          <ul>
            {balances.map((b, idx) => (
              <li key={idx}>
                {b.member} contributed <strong>{formatKsh(b.paid)}</strong>
              </li>
            ))}
          </ul>

          <h3>❌ People Who Did NOT Contribute</h3>
          {balances.filter((b) => b.paid === 0).length === 0 ? (
            <p>✅ Everyone contributed something.</p>
          ) : (
            <ul>
              {balances
                .filter((b) => b.paid === 0)
                .map((b, idx) => (
                  <li key={idx}>{b.member}</li>
                ))}
            </ul>
          )}

          <h3>💰 Who Owes / Who Receives</h3>
          <ul>
            {balances.map((b, idx) => (
              <li key={idx}>
                <strong>{b.member}</strong>:{" "}
                {b.balance >= 0 ? (
                  <>✅ Receives {formatKsh(b.balance)}</>
                ) : (
                  <>⚠️ Owes {formatKsh(Math.abs(b.balance))}</>
                )}
              </li>
            ))}
          </ul>

          <hr />

          <h3>📌 Who Pays Who (Final Settlement)</h3>
          {settlementTransactions.length === 0 ? (
            <p>✅ No transfers needed (everyone is balanced).</p>
          ) : (
            <ul>
              {settlementTransactions.map((t, idx) => (
                <li key={idx}>
                  <strong>{t.from}</strong> pays <strong>{t.to}</strong>{" "}
                  <strong>{formatKsh(t.amount)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;


