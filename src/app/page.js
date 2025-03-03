// src/app/page.js
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Home() {
  const [salesStats, setSalesStats] = useState({
    today: { count: 0, total: 0 },
    week: { count: 0, total: 0 },
    month: { count: 0, total: 0 }
  });
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch transactions from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_ETIMS_BACKEND_URL || 'http://localhost:5000'}/api/etims/transactions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch transaction data');
        }
        
        const data = await response.json();
        setRecentTransactions(data.transactions || []);
        
        // Calculate statistics from  transactions
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
        
        // Filter transactions and calculate stats
        const todayTransactions = data.transactions.filter(tx => new Date(tx.timestamp).getTime() >= today);
        const weekTransactions = data.transactions.filter(tx => new Date(tx.timestamp).getTime() >= oneWeekAgo);
        const monthTransactions = data.transactions.filter(tx => new Date(tx.timestamp).getTime() >= oneMonthAgo);
        
        // Calculate totals
        const todayTotal = todayTransactions.reduce((sum, tx) => sum + tx.total, 0);
        const weekTotal = weekTransactions.reduce((sum, tx) => sum + tx.total, 0);
        const monthTotal = monthTransactions.reduce((sum, tx) => sum + tx.total, 0);
        
        setSalesStats({
          today: { count: todayTransactions.length, total: todayTotal },
          week: { count: weekTransactions.length, total: weekTotal },
          month: { count: monthTransactions.length, total: monthTotal }
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Could not load dashboard data. Using sample data instead.");
        
        //  sample data 
        setSalesStats({
          today: { count: Math.floor(Math.random() * 20) + 5, total: (Math.floor(Math.random() * 150) + 50) * 100 },
          week: { count: 48, total: 156750 },
          month: { count: 183, total: 597450 }
        });
        
        setRecentTransactions([
          { id: 'ETIMS-1686315', timestamp: '2023-06-15T14:35:22', items: 5, total: 12500, status: 'Completed' },
          { id: 'ETIMS-1686293', timestamp: '2023-06-15T11:42:18', items: 2, total: 3200, status: 'Completed' },
          { id: 'ETIMS-1686274', timestamp: '2023-06-15T08:15:05', items: 8, total: 24750, status: 'Completed' },
          { id: 'ETIMS-1686251', timestamp: '2023-06-14T16:28:33', items: 3, total: 9600, status: 'Completed' },
          { id: 'ETIMS-1686212', timestamp: '2023-06-14T12:05:47', items: 1, total: 1850, status: 'Completed' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    //  periodic refresh every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ETIMS <span className="text-blue-600">Dashboard</span></h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back to your Electronic Tax Invoice Management System</p>
            </div>
            <Link 
              href="/pos" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Open Sales Terminal
            </Link> 
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Error Notification */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-md shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Today&apos;s Sales</p>
                <p className="text-2xl font-bold text-gray-800">{salesStats.today.total.toLocaleString()} KES</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <p className="text-xs text-gray-500">{salesStats.today.count} transactions</p>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">This Week</p>
                <p className="text-2xl font-bold text-gray-800">{salesStats.week.total.toLocaleString()} KES</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">{salesStats.week.count} transactions</p>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">This Month</p>
                <p className="text-2xl font-bold text-gray-800">{salesStats.month.total.toLocaleString()} KES</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">{salesStats.month.count} transactions</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-md shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link href="/pos" className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 rounded-md transition-colors group">
                  <div className="h-10 w-10 bg-blue-100 group-hover:bg-blue-200 rounded-md flex items-center justify-center text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">New Sale</h3>
                    <p className="text-xs text-gray-500">Process a new transaction</p>
                  </div>
                </Link>

                <button className="flex items-center w-full p-3 bg-gray-50 hover:bg-green-50 rounded-md transition-colors group">
                  <div className="h-10 w-10 bg-green-100 group-hover:bg-green-200 rounded-md flex items-center justify-center text-green-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Generate Report</h3>
                    <p className="text-xs text-gray-500">Create tax summary reports</p>
                  </div>
                </button>

                {/* <button className="flex items-center w-full p-3 bg-gray-50 hover:bg-purple-50 rounded-md transition-colors group">
                  <div className="h-10 w-10 bg-purple-100 group-hover:bg-purple-200 rounded-md flex items-center justify-center text-purple-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Verify Receipt</h3>
                    <p className="text-xs text-gray-500">Check ETIMS receipt validity</p>
                  </div>
                </button> */}
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">ETIMS Connection</span>
                  </div>
                  <span className="text-xs font-medium text-green-700">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Database</span>
                  </div>
                  <span className="text-xs font-medium text-green-700">Operational</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Sync Status</span>
                  </div>
                  <span className="text-xs font-medium text-yellow-700">Last: {loading ? 'Checking...' : `${new Date().toLocaleTimeString()}`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-md shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">View All</button>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-500">Loading transactions...</span>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <p>No transactions found.</p>
                  <p className="text-sm mt-2">Process a sale to see transaction history.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt ID</th>
                        <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTransactions.map((tx, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-800 font-medium">{tx.id}</td>
                          <td className="p-3 text-sm text-gray-600">
                            {new Date(tx.timestamp).toLocaleDateString()} 
                            <span className="text-gray-400 ml-1">{new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{tx.items}</td>
                          <td className="p-3 text-sm text-gray-800 font-medium">{tx.total.toLocaleString()} KES</td>
                          <td className="p-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6 flex items-center">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 text-sm">ETIMS Compliance Status: Active</h3>
                <p className="text-sm text-blue-600">Your system is up-to-date and compliant with current tax regulations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}