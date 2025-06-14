import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", currency: "INR" });
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://v6.exchangerate-api.com/v6/133676cc6df82820dea3d978/latest/INR");
      const data = await res.json();
      setExchangeRate(data.conversion_rates.USD);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError("Failed to fetch exchange rate.");
    } finally {
      setLoading(false);
    }
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target || parseFloat(newGoal.target) <= 0) {
      alert("Please enter valid goal details.");
      return;
    }
    setGoals([...goals, { ...newGoal, saved: 0, contributions: [] }]);
    setNewGoal({ name: "", target: "", currency: "INR" });
  };

  const addContribution = (index, amount) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Invalid contribution amount.");
      return;
    }
    const updatedGoals = [...goals];
    updatedGoals[index].saved += parseFloat(amount);
    updatedGoals[index].contributions.push({ amount, date: new Date().toLocaleDateString() });
    setGoals(updatedGoals);
  };

  const totalTarget = goals.reduce((acc, goal) => acc + parseFloat(goal.target), 0);
  const totalSaved = goals.reduce((acc, goal) => acc + parseFloat(goal.saved), 0);
  const overallProgress = goals.length ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="app">
      <h1>💰 Savings Planner</h1>

      <div className="banner">
        <p>Total Target: ₹{totalTarget.toFixed(2)}</p>
        <p>Total Saved: ₹{totalSaved.toFixed(2)}</p>
        <p>Progress: {overallProgress.toFixed(2)}%</p>
      </div>

      <div className="exchange">
        {loading ? (
          <p>Loading exchange rate...</p>
        ) : (
          <>
            <p>INR to USD: {exchangeRate}</p>
            <p>Last updated: {lastUpdated}</p>
            <button onClick={fetchExchangeRate}>Refresh Rate</button>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="form">
        <input
          placeholder="Goal Name"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
        />
        <select
          value={newGoal.currency}
          onChange={(e) => setNewGoal({ ...newGoal, currency: e.target.value })}
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
        <button onClick={addGoal}>Add Goal</button>
      </div>

      <div className="goals">
        {goals.map((goal, idx) => (
          <div key={idx} className="goal-card">
            <h3>{goal.name}</h3>
            <p>
              Target: {goal.target} {goal.currency}
            </p>
            <p>
              Converted:{" "}
              {goal.currency === "INR"
                ? (goal.target * exchangeRate).toFixed(2) + " USD"
                : (goal.target / exchangeRate).toFixed(2) + " INR"}
            </p>
            <p>Saved: {goal.saved.toFixed(2)}</p>
            <progress value={goal.saved} max={goal.target}></progress>
            <button
              onClick={() => {
                const amt = prompt("Enter contribution amount:");
                if (amt) addContribution(idx, amt);
              }}
            >
              Add Contribution
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
