import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import {
  Users, BarChart2, MessageSquare, Bell, Trash2, Plus,
  ShieldAlert, TrendingUp, Activity, DollarSign, X, Check, Loader2
} from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin`;

type Tab = 'overview' | 'users' | 'strategies' | 'community' | 'alerts' | 'payments';

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem('adminToken') || '';
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Alert form
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('info');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats = async () => {
    const r = await fetch(`${API}/stats`, { headers });
    const d = await r.json();
    setStats(d);
  };

  const fetchUsers = async () => {
    const r = await fetch(`${API}/users`, { headers });
    const d = await r.json();
    setUsers(d.users || []);
  };

  const fetchStrategies = async () => {
    const r = await fetch(`${API}/strategies`, { headers });
    const d = await r.json();
    setStrategies(d.strategies || []);
  };

  const fetchDiscussions = async () => {
    const r = await fetch(`${API}/discussions`, { headers });
    const d = await r.json();
    setDiscussions(d.discussions || []);
  };

  const fetchAlerts = async () => {
    const r = await fetch(`${API}/alerts`, { headers });
    const d = await r.json();
    setAlerts(d.alerts || []);
  };

  const fetchPayments = async () => {
    const r = await fetch(`${API}/payments`, { headers });
    const d = await r.json();
    setPayments(d.payments || []);
  };

  const fetchPaymentRequests = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const r = await fetch(`${apiUrl}/payments/requests`, { headers });
    const d = await r.json();
    setPaymentRequests(d.requests || []);
  };

  const approveRequest = async (id: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    await fetch(`${apiUrl}/payments/requests/${id}/approve`, { method: 'POST', headers });
    toast({ title: 'Approved! User subscription activated.' });
    fetchPaymentRequests();
  };

  const rejectRequest = async (id: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    await fetch(`${apiUrl}/payments/requests/${id}/reject`, { method: 'POST', headers });
    toast({ title: 'Request rejected.' });
    fetchPaymentRequests();
  };

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { navigate('/admin-login'); return; }
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'strategies') fetchStrategies();
    if (tab === 'community') fetchDiscussions();
    if (tab === 'alerts') fetchAlerts();
    if (tab === 'payments') { fetchPayments(); fetchPaymentRequests(); }
  }, [tab]);

  const deleteItem = async (endpoint: string, id: string, refresh: () => void) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API}/${endpoint}/${id}`, { method: 'DELETE', headers });
    toast({ title: 'Deleted successfully' });
    refresh();
  };

  const sendAlert = async () => {
    if (!alertTitle || !alertMsg) return;
    setLoading(true);
    await fetch(`${API}/alerts`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: alertTitle, message: alertMsg, type: alertType }),
    });
    setAlertTitle(''); setAlertMsg(''); setAlertType('info');
    toast({ title: 'Alert sent!' });
    fetchAlerts();
    setLoading(false);
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview',   label: 'Overview',    icon: BarChart2 },
    { id: 'users',      label: 'Users',       icon: Users },
    { id: 'strategies', label: 'Strategies',  icon: TrendingUp },
    { id: 'community',  label: 'Community',   icon: MessageSquare },
    { id: 'alerts',     label: 'Alerts',      icon: Bell },
    { id: 'payments',   label: 'Payments',    icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Header />
      <div className="pt-20 px-6 max-w-7xl mx-auto pb-12">

        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-violet-400" />
            <h1 className="text-2xl font-black tracking-tight">Admin Panel</h1>
          </div>
          <button
            onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin-login'); }}
            className="px-4 py-1.5 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 text-sm transition-all"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit flex-wrap">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === id ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users',      value: stats?.totalUsers ?? '—',      icon: Users,       color: 'text-blue-400',   bg: 'bg-blue-500/10' },
                { label: 'Active (30d)',      value: stats?.activeUsers ?? '—',     icon: Activity,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Strategies',        value: stats?.totalStrategies ?? '—', icon: TrendingUp,  color: 'text-violet-400',  bg: 'bg-violet-500/10' },
                { label: 'Discussions',       value: stats?.totalDiscussions ?? '—',icon: MessageSquare,color: 'text-amber-400',  bg: 'bg-amber-500/10' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-white/40 text-xs mt-1 tracking-wide">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
              <h2 className="font-bold text-white/70 mb-4 text-sm uppercase tracking-widest">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Manage Users',      action: () => setTab('users') },
                  { label: 'Manage Strategies', action: () => setTab('strategies') },
                  { label: 'Moderate Community',action: () => setTab('community') },
                  { label: 'Send Alert',         action: () => setTab('alerts') },
                ].map(({ label, action }) => (
                  <button key={label} onClick={action}
                    className="px-4 py-2 rounded-full bg-white/8 hover:bg-violet-600 text-sm font-medium transition-all border border-white/10">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/8 flex items-center justify-between">
              <h2 className="font-bold">All Users <span className="text-white/30 text-sm ml-2">{users.length}</span></h2>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">{stats?.activeUsers ?? 0} active (30d)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-white/30 text-xs uppercase tracking-widest">
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Joined</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const isRecent = new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    return (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400 shrink-0">
                              {u.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <span className="font-medium">{u.name}</span>
                            {isRecent && <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full">New</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-white/50">{u.email}</td>
                        <td className="px-5 py-3 text-white/40">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => deleteItem('users', u.id, fetchUsers)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-white/30 py-12">No users found</p>}
            </div>
          </div>
        )}

        {/* ── STRATEGIES ── */}
        {tab === 'strategies' && (
          <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/8 flex items-center justify-between">
              <h2 className="font-bold">Strategies <span className="text-white/30 text-sm ml-2">{strategies.length}</span></h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-white/30 text-xs uppercase tracking-widest">
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Category</th>
                    <th className="text-left px-5 py-3">Win Rate</th>
                    <th className="text-left px-5 py-3">Risk</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {strategies.map(s => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 font-medium">{s.name}</td>
                      <td className="px-5 py-3 text-white/50">{s.category}</td>
                      <td className="px-5 py-3 text-emerald-400">{s.win_rate ?? '—'}%</td>
                      <td className="px-5 py-3 text-white/50">{s.risk_level ?? '—'}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => deleteItem('strategies', s.id, fetchStrategies)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {strategies.length === 0 && <p className="text-center text-white/30 py-12">No strategies found</p>}
            </div>
          </div>
        )}

        {/* ── COMMUNITY ── */}
        {tab === 'community' && (
          <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/8">
              <h2 className="font-bold">Discussions <span className="text-white/30 text-sm ml-2">{discussions.length}</span></h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-white/30 text-xs uppercase tracking-widest">
                    <th className="text-left px-5 py-3">Title</th>
                    <th className="text-left px-5 py-3">Author</th>
                    <th className="text-left px-5 py-3">Category</th>
                    <th className="text-left px-5 py-3">Likes</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {discussions.map(d => (
                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 font-medium max-w-xs truncate">{d.title}</td>
                      <td className="px-5 py-3 text-white/50">{d.users?.name ?? '—'}</td>
                      <td className="px-5 py-3 text-white/40">{d.category}</td>
                      <td className="px-5 py-3 text-white/40">{d.likes ?? 0}</td>
                      <td className="px-5 py-3 text-white/40">{new Date(d.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => deleteItem('discussions', d.id, fetchDiscussions)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {discussions.length === 0 && <p className="text-center text-white/30 py-12">No discussions found</p>}
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {tab === 'alerts' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Send alert form */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
              <h2 className="font-bold mb-5 flex items-center gap-2"><Plus className="w-4 h-4 text-violet-400" />Send New Alert</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Title</label>
                  <input value={alertTitle} onChange={e => setAlertTitle(e.target.value)}
                    placeholder="Alert title..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Message</label>
                  <textarea value={alertMsg} onChange={e => setAlertMsg(e.target.value)}
                    placeholder="Alert message..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Type</label>
                  <select value={alertType} onChange={e => setAlertType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <button onClick={sendAlert} disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                  Send Alert
                </button>
              </div>
            </div>

            {/* Alert list */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
              <h2 className="font-bold mb-5">Sent Alerts <span className="text-white/30 text-sm ml-2">{alerts.length}</span></h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.length === 0 && <p className="text-white/30 text-sm text-center py-8">No alerts sent yet</p>}
                {alerts.map(a => {
                  const colors: any = { info: 'border-blue-500/30 bg-blue-500/5', success: 'border-emerald-500/30 bg-emerald-500/5', warning: 'border-amber-500/30 bg-amber-500/5', danger: 'border-red-500/30 bg-red-500/5' };
                  const dot: any = { info: 'bg-blue-400', success: 'bg-emerald-400', warning: 'bg-amber-400', danger: 'bg-red-400' };
                  return (
                    <div key={a.id} className={`border rounded-xl p-4 flex items-start justify-between gap-3 ${colors[a.type] || colors.info}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot[a.type] || dot.info}`} />
                        <div>
                          <p className="font-semibold text-sm">{a.title}</p>
                          <p className="text-white/50 text-xs mt-0.5">{a.message}</p>
                          <p className="text-white/25 text-xs mt-1">{new Date(a.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteItem('alerts', a.id, fetchAlerts)}
                        className="text-white/20 hover:text-red-400 transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === 'payments' && (
          <div className="space-y-6">
            {/* Pending payment requests */}
            <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/8 flex items-center justify-between">
                <h2 className="font-bold">Pending Payment Requests
                  <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                    {paymentRequests.filter(r => r.status === 'pending').length} pending
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-white/30 text-xs uppercase tracking-widest">
                      <th className="text-left px-5 py-3">Name</th>
                      <th className="text-left px-5 py-3">Email</th>
                      <th className="text-left px-5 py-3">Plan</th>
                      <th className="text-left px-5 py-3">Chain</th>
                      <th className="text-left px-5 py-3">Amount</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Date</th>
                      <th className="px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentRequests.map(r => {
                      const statusColor = r.status === 'approved' ? 'text-emerald-400 bg-emerald-500/10' : r.status === 'rejected' ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10';
                      return (
                        <tr key={r.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="px-5 py-3 font-medium">{r.name}</td>
                          <td className="px-5 py-3 text-white/50">{r.email}</td>
                          <td className="px-5 py-3 text-violet-400 capitalize font-bold">{r.plan}</td>
                          <td className="px-5 py-3 text-white/40 text-xs">{r.chain}</td>
                          <td className="px-5 py-3 text-emerald-400 font-bold">{r.amount}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>{r.status}</span>
                          </td>
                          <td className="px-5 py-3 text-white/40">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3">
                            {r.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button onClick={() => approveRequest(r.id)}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => rejectRequest(r.id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {paymentRequests.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No payment requests yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
