import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './PlayGame.module.css';

type Transaction = {
  transactionid: number;
  entity: string;
  units: number;
  totalamount: number;
  createdat: string;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      window.location.href = '/';
      return;
    }
    async function fetchTransactions() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/transaction/fetchOrderHistory`,
          { params: { clientId } }
        );
        // Sort transactions by transactionid ascending
        const sorted = (res.data.orderHistory || []).sort(
          (a: Transaction, b: Transaction) => a.transactionid - b.transactionid
        );
        setTransactions(sorted);
      } catch (error) {
        alert('Failed to fetch transactions.');
      }
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <span className={styles.spinner}></span>
        Loading...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>🧾 Transaction History</h1>
        </div>
        <button
          onClick={() => {
            window.location.href = '/client';
          }}
          className={styles.logoutButton}
        >
          Back to Dashboard
        </button>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.gameCard}>
          <h2>All Transactions</h2>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>ID</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Entity</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Units</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Amount</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.transactionid}>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{tx.transactionid}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{tx.entity}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{tx.units}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>₹ {tx.totalamount}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{tx.createdat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;