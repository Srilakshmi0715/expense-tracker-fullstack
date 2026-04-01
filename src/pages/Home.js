import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BalanceDisplay from '../components/BalanceDisplay';
import BudgetSection from '../components/BudgetSection';
import RecurringTransactions from '../components/RecurringTransactions';
import FinancialGoals from '../components/FinancialGoals';
import CurrencyConverter from '../components/CurrencyConverter';
import TransactionReminders from '../components/TransactionReminders';
import ExpenseSharing from '../components/ExpenseSharing';
import DataImporter from '../components/DataImporter';
import AIInsights from '../components/AIInsights';
import { transactionsAPI, budgetsAPI, goalsAPI } from '../services/api';

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    // Load data from backend API
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionsAPI.getAll(),
        budgetsAPI.getAll(),
        goalsAPI.getAll()
      ]);
      
      setTransactions(transactionsData);
      
      // Convert budgets array to object for compatibility
      const budgetsObj = budgetsData.reduce((acc, budget) => {
        acc[budget.category] = budget.amount;
        return acc;
      }, {});
      setBudgets(budgetsObj);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to localStorage if API fails
      const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const savedBudgets = JSON.parse(localStorage.getItem('budgets') || '{}');
      setTransactions(savedTransactions);
      setBudgets(savedBudgets);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const newTransaction = await transactionsAPI.create(transaction);
      setTransactions([...transactions, newTransaction]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Fallback to localStorage
      const newTransaction = { ...transaction, id: Date.now() };
      const newTransactions = [...transactions, newTransaction];
      setTransactions(newTransactions);
      localStorage.setItem('transactions', JSON.stringify(newTransactions));
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionsAPI.delete(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Fallback to localStorage
      const newTransactions = transactions.filter(t => t.id !== id);
      setTransactions(newTransactions);
      localStorage.setItem('transactions', JSON.stringify(newTransactions));
    }
  };

  const setBudget = (category, amount) => {
    const newBudgets = { ...budgets, [category]: amount };
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const handleImportTransactions = (importedTransactions) => {
    const updated = [...transactions, ...importedTransactions];
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  return (
    <div className="container">
      <BalanceDisplay transactions={transactions} />
      
      <CurrencyConverter 
        amount={transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)} 
        onCurrencyChange={(currency, rate) => {
          setCurrentCurrency(currency);
          setExchangeRate(rate);
        }}
      />
      
      <TransactionForm onAddTransaction={addTransaction} />
      
      <AIInsights transactions={transactions} />
      
      <TransactionReminders transactions={transactions} />
      
      <DataImporter onImport={handleImportTransactions} />
      
      <ExpenseSharing transactions={transactions} />
      
      <RecurringTransactions />
      
      <FinancialGoals />
      
      <BudgetSection 
        transactions={transactions} 
        budgets={budgets} 
        onSetBudget={setBudget} 
      />
      
      <TransactionList 
        transactions={transactions} 
        onDeleteTransaction={deleteTransaction} 
      />
    </div>
  );
};

export default Home;
