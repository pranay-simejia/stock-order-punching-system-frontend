import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './PlayGame.module.css';

type ClientData = {
  clientid: number;
  name: string;
  age: number;
  gender?: string;
  pancard?: string;
};

type PortfolioItem = {
  entity: string;
  total_units: number;
  total_amount: number;
};

const PlayGame = () => {
  const [client, setClient] = useState<ClientData | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [investLoading, setInvestLoading] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      window.location.href = '/';
      return;
    }
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch client details
        const clientRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/client/find/${clientId}`
        );
        setClient(clientRes.data.client);

        // Fetch balance
        const balanceRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/transaction/fetchBalance`,
          { params: { clientId } }
        );
        setBalance(balanceRes.data.balance);

        // Fetch portfolio
        const portfolioRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/client/portfolio/${clientId}`
        );
        setPortfolio(portfolioRes.data.portfolio || []);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleInvestNow = async () => {
    setInvestLoading(true);
    try {
      const clientId = localStorage.getItem('clientId');
      // You can customize these values or get from user input
      const maxStocks = 20 - portfolio.length;
      const investAmount = balance && maxStocks > 0 ? balance / maxStocks : 0;
      const payload = {
        clientId: Number(clientId),
        maxStocks,
        maxAmount: investAmount,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/client/autoPlaceOrder`,
        payload
      );
      alert(response.data.message || 'Investment order placed!');
      // Optionally, refresh portfolio/balance here
      window.location.reload();
    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
          'Failed to place investment order.'
      );
    }
    setInvestLoading(false);
  };

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const clientId = localStorage.getItem('clientId');
      const payload = {
        clientid: Number(clientId),
        amount: Number(addAmount),
      };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/transaction/addBalance`,
        payload
      );
      alert(response.data.message || 'Balance added!');
      setShowAddBalance(false);
      setAddAmount('');
      window.location.reload();
    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
        'Failed to add balance.'
      );
    }
    setAddLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <span className={styles.spinner}></span>
        Loading...
      </div>
    );
  }

  if (!client) {
    return (
      <div className={styles.loadingContainer}>
        Client not found. Please log in again.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>📊 Client Portfolio Dashboard</h1>
          <h2>Welcome, {client.name}!</h2>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('clientId');
            window.location.href = '/';
          }}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.gameCard}>
          <h2>Client Details</h2>
          <div style={{ marginBottom: 24 }}>
            <p>
              <strong>ID:</strong> {client.clientid}
            </p>
            <p>
              <strong>Name:</strong> {client.name}
            </p>
            <p>
              <strong>Age:</strong> {client.age}
            </p>
            {client.gender && (
              <p>
                <strong>Gender:</strong> {client.gender}
              </p>
            )}
            {client.pancard && (
              <p>
                <strong>PAN:</strong> {client.pancard}
              </p>
            )}
          </div>

          <h2>Current Balance</h2>
          <div style={{ marginBottom: 24 }}>
            <p>
              <strong>₹ {balance}</strong>
            </p>
          </div>

          <button
            className={styles.investButton}
            onClick={handleInvestNow}
            disabled={investLoading}
            style={{ marginBottom: '2rem' }}
          >
            {investLoading ? 'Investing...' : 'Invest Now'}
          </button>
          <button
            className={styles.investButton}
            style={{ marginBottom: '2rem', marginLeft: '1rem' }}
            onClick={() => window.location.href = '/transactions'}
          >
            Show Transactions
          </button>
          <button
            className={styles.investButton}
            style={{ marginBottom: '1rem', marginLeft: '1rem' }}
            onClick={() => setShowAddBalance(true)}
          >
            Add Balance
          </button>

          {showAddBalance && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowAddBalance(false)}
                >
                  Close
                </button>
                <h2>Add Balance</h2>
                <form onSubmit={handleAddBalance}>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={addAmount}
                    min={1}
                    onChange={e => setAddAmount(e.target.value)}
                    className={styles.loginInput}
                    required
                  />
                  <button
                    type="submit"
                    className={styles.investButton}
                    disabled={addLoading}
                    style={{ marginLeft: '1rem' }}
                  >
                    {addLoading ? 'Adding...' : 'Add'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <h2>Portfolio</h2>
          {portfolio.length === 0 ? (
            <p>No stocks in portfolio.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Stock</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Units</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item.entity}>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                      {item.entity}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                      {item.total_units}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                      ₹ {item.total_amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 HFT Stock Punching System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PlayGame;