import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, TrendingUp, ThumbsUp, MessageCircle, Clock, Plus, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  views: number;
  created_at: string;
  user: { name: string; email: string };
  replies: { count: number }[];
}

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const initials = (name: string) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

const categories = ['All', 'Strategy', 'Risk Management', 'Automation', 'Education', 'Analysis', 'News'];

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: 'Strategy' });

  const token = localStorage.getItem('token') || '';

  const fetchDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAllDiscussions(token);
      setDiscussions(data.discussions || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load discussions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchDiscussions(); }, [fetchDiscussions]);

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    try {
      setSubmitting(true);
      await api.createDiscussion(token, newDiscussion);
      setNewDiscussion({ title: '', content: '', category: 'Strategy' });
      setIsDialogOpen(false);
      toast({ title: 'Posted!', description: 'Your discussion is live.' });
      fetchDiscussions();
    } catch {
      toast({ title: 'Error', description: 'Failed to create discussion', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = discussions.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const replyCount = (d: Discussion) => d.replies?.[0]?.count ?? 0;
  const isHot = (d: Discussion) => d.likes > 20 || replyCount(d) > 10;

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-emerald-500" />
            <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Community</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">Trader Hub</h1>
          <p className="text-white/40 text-base">Connect with traders and share insights</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Active Members', value: '1,234', sub: '+12% from last month', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
            { label: 'Total Discussions', value: String(discussions.length), sub: 'Active conversations', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
            { label: 'Engagement Rate', value: '89%', sub: 'High community activity', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border ${s.border} bg-white/[0.03] p-6`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/30">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className="text-4xl font-black tracking-tight text-white mb-1">{s.value}</div>
              <p className="text-sm text-white/30">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Search + New Discussion */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all">
                <Plus className="w-4 h-4" />New Discussion
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#0f1629] border border-white/[0.1] text-white">
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-bold">Start a New Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Title</Label>
                  <input
                    placeholder="What's your discussion about?"
                    value={newDiscussion.title}
                    onChange={e => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Category</Label>
                  <select
                    value={newDiscussion.category}
                    onChange={e => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat} className="bg-[#0f1629]">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Content</Label>
                  <textarea
                    placeholder="Share your thoughts in detail..."
                    rows={6}
                    value={newDiscussion.content}
                    onChange={e => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsDialogOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
                    Cancel
                  </button>
                  <button onClick={handleCreateDiscussion} disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold text-sm transition-all">
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Discussion
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/80'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Discussion list */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white font-bold text-base">Recent Discussions</p>
            <span className="text-xs text-white/30">{filtered.length} {filtered.length === 1 ? 'discussion' : 'discussions'}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-white/30" />
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(d => (
                <div key={d.id} onClick={() => navigate(`/discussion/${d.id}`)}
                  className="p-4 rounded-xl border border-white/[0.05] hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer transition-all group">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-white/[0.08] text-white/70 text-sm font-bold">{initials(d.user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{d.title}</h3>
                        {isHot(d) && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold">HOT</span>
                        )}
                      </div>
                      <p className="text-sm text-white/40 mb-3 line-clamp-2">{d.content}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                        <span className="font-medium text-white/70">{d.user?.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50">{d.category}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(d.created_at)}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{replyCount(d)} replies</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{d.likes}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{d.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && !loading && (
                <div className="text-center py-16 text-white/30">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No discussions found. Be the first to start one!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
