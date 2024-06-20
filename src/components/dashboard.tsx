import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
import '../App.css';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { userId } = useAuth();
  const [expenses, setExpenses] = useState<{ description: string; amount: number; category: string }[]>([]);
  const [incomes, setIncomes] = useState<{ source: string; amount: number; category: string }[]>([]);
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (userId) {
      const savedExpenses = localStorage.getItem(`expenses_${userId}`);
      const savedIncomes = localStorage.getItem(`incomes_${userId}`);
      const savedBudget = localStorage.getItem(`budget_${userId}`);

      if (savedExpenses) {
        try {
          setExpenses(JSON.parse(savedExpenses));
        } catch (e) {
          console.error('Error parsing saved expenses:', e);
          setExpenses([]);
        }
      }

      if (savedIncomes) {
        try {
          setIncomes(JSON.parse(savedIncomes));
        } catch (e) {
          console.error('Error parsing saved incomes:', e);
          setIncomes([]);
        }
      }

      if (savedBudget) {
        try {
          setBudget(JSON.parse(savedBudget));
        } catch (e) {
          console.error('Error parsing saved budget:', e);
          setBudget(undefined);
        }
      }
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses));
    }
  }, [expenses, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`incomes_${userId}`, JSON.stringify(incomes));
    }
  }, [incomes, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`budget_${userId}`, JSON.stringify(budget));
    }
  }, [budget, userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000); // Show welcome message for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);

  return (
    <div>
      {showWelcome && userId && (
        <div className="welcome-message">
          <p>Welcome, {userId}!</p>
        </div>
      )}
      <div className="header">Personal Expense Tracker</div>
      <div className="dashboard-background" id="dashboard">
        <div className="dashboard">
          <h2>Dashboard</h2>
          <p>Welcome to your dashboard!</p>
          <div className="summary">
            <div onClick={() => document.getElementById('expenses-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <p>Total Expense</p>
              <p>${totalExpense}</p>
            </div>
            <div onClick={() => document.getElementById('income-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <p>Total Income</p>
              <p>${totalIncome}</p>
            </div>
            <div onClick={() => document.getElementById('budget-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <p>Check Budget</p>
              <p>${budget !== undefined ? budget : 'Not set'}</p>
            </div>
            <div onClick={() => document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <p>View Report</p>
            </div>
          </div>
          <a href="/login">Logout</a>
        </div>
      </div>

      <ExpenseTrackingSection expenses={expenses} setExpenses={setExpenses} />
      <IncomeTrackingSection incomes={incomes} setIncomes={setIncomes} />
      <BudgetSection budget={budget} setBudget={setBudget} />
      <ReportSection expenses={expenses} incomes={incomes} />
      <FooterSection />
    </div>
  );
};

const ExpenseTrackingSection: React.FC<{ expenses: any[], setExpenses: any }> = ({ expenses, setExpenses }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [showAll, setShowAll] = useState(false);

  const addExpense = () => {
    if (description && amount && category) {
      setExpenses([...expenses, { description, amount, category }]);
      setDescription('');
      setAmount(undefined);
      setCategory('');
    }
  };

  const deleteExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const visibleExpenses = showAll ? expenses : expenses.slice(0, 5);

  return (
    <div className="expenses-background section" id="expenses-section">
      <div className="expenses-container">
        <h2>Expense Tracking</h2>
        <form onSubmit={(e) => { e.preventDefault(); addExpense(); }}>
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label>Amount</label>
          <input type="number" value={amount || ''} onChange={(e) => setAmount(parseFloat(e.target.value))} />
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Others">Others</option>
          </select>
          <button type="submit">Add Expense</button>
        </form>
        <div className="expenses-list">
          <h3>Expenses List</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.description}</td>
                  <td>${expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>
                    <button onClick={() => deleteExpense(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!showAll && expenses.length > 5 && (
            <div className="view-more">
              <button onClick={() => setShowAll(true)}>View More</button>
            </div>
          )}
          {showAll && expenses.length > 5 && (
            <div className="view-more">
              <button onClick={() => setShowAll(false)}>Show Less</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IncomeTrackingSection: React.FC<{ incomes: any[], setIncomes: any }> = ({ incomes, setIncomes }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [showAll, setShowAll] = useState(false);

  const addIncome = () => {
    if (source && amount && category) {
      setIncomes([...incomes, { source, amount, category }]);
      setSource('');
      setAmount(undefined);
      setCategory('');
    }
  };

  const deleteIncome = (index: number) => {
    const newIncomes = incomes.filter((_, i) => i !== index);
    setIncomes(newIncomes);
  };

  const visibleIncomes = showAll ? incomes : incomes.slice(0, 5);

  return (
    <div className="income-background section" id="income-section">
      <div className="income-container">
        <h2>Income Tracking</h2>
        <form onSubmit={(e) => { e.preventDefault(); addIncome(); }}>
          <label>Source</label>
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
          <label>Amount</label>
          <input type="number" value={amount || ''} onChange={(e) => setAmount(parseFloat(e.target.value))} />
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option value="Salary">Salary</option>
            <option value="Business">Business</option>
            <option value="Investments">Investments</option>
            <option value="Others">Others</option>
          </select>
          <button type="submit">Add Income</button>
        </form>
        <div className="income-list">
          <h3>Income List</h3>
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleIncomes.map((income, index) => (
                <tr key={index}>
                  <td>{income.source}</td>
                  <td>${income.amount}</td>
                  <td>{income.category}</td>
                  <td>
                    <button onClick={() => deleteIncome(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!showAll && incomes.length > 5 && (
            <div className="view-more">
              <button onClick={() => setShowAll(true)}>View More</button>
            </div>
          )}
          {showAll && incomes.length > 5 && (
            <div className="view-more">
              <button onClick={() => setShowAll(false)}>Show Less</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BudgetSection: React.FC<{ budget: number | undefined, setBudget: (value: number) => void }> = ({ budget, setBudget }) => {
  const [budgetInput, setBudgetInput] = useState<number | undefined>(budget);

  const handleSetBudget = () => {
    if (budgetInput !== undefined) {
      setBudget(budgetInput);
    }
  };

  return (
    <div className="budget-background section" id="budget-section">
      <div className="budget-container">
        <h2>Budgeting Tool</h2>
        <p>Set a basic monthly budget and track spending against it</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSetBudget(); }}>
          <label>Monthly Budget</label>
          <input
            type="number"
            value={budgetInput || ''}
            onChange={(e) => setBudgetInput(parseFloat(e.target.value))}
          />
          <button type="submit">Set Budget</button>
        </form>
        {budget !== undefined && (
          <div>
            <h3>Current Budget: ${budget}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const ReportSection: React.FC<{ expenses: any[], incomes: any[] }> = ({ expenses, incomes }) => {
  const expenseCategories = expenses.reduce((acc, expense) => {
    acc[expense.category] = acc[expense.category] ? acc[expense.category] + expense.amount : expense.amount;
    return acc;
  }, {});

  const incomeCategories = incomes.reduce((acc, income) => {
    acc[income.category] = acc[income.category] ? acc[income.category] + income.amount : income.amount;
    return acc;
  }, {});

  const expenseData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        label: 'Expenses',
        data: Object.values(expenseCategories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
        ],
      },
    ],
  };

  const incomeData = {
    labels: Object.keys(incomeCategories),
    datasets: [
      {
        label: 'Incomes',
        data: Object.values(incomeCategories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
        ],
      },
    ],
  };

  return (
    <div className="report-background section" id="report-section">
      <div className="report-container">
        <h2>View Report</h2>
        <div className="chart-container">
          <Pie data={expenseData} />
        </div>
        <div className="chart-container">
          <Bar data={incomeData} />
        </div>

      </div>
    </div>
  );
};

const FooterSection: React.FC = () => {
  return (
    <div className="footer-background">
      <div className="footer-container">
        <h2>About Us</h2>
        <p>Dedicated to helping you manage your personal finances effectively and efficiently. The tools are designed to provide you with insights into your spending and income patterns, helping you make informed decisions about your financial future.</p>
        <div className="footer-links">
        </div>
        <div className="footer-contact">
          <p>Email: sarimfarooq1212@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
