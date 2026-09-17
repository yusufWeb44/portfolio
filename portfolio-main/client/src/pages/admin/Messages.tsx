import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Mail, MailOpen, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/messages');
        setMessages(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleToggleRead = async (message: Message) => {
    try {
      const updated = { ...message, isRead: !message.isRead };
      await api.put(`/messages/${message.id}`, updated);
      setMessages(messages.map(m => m.id === message.id ? updated : m));
      if (selectedMessage?.id === message.id) {
        setSelectedMessage(updated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-[80vh] flex flex-col">
      <Helmet>
        <title>Messages | Admin Dashboard</title>
      </Helmet>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground text-sm">Inbox and inquiries from the contact form.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9 bg-card border-border h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 bg-card border border-border rounded-xl overflow-hidden h-[calc(100vh-200px)] min-h-[500px]">
          
          {/* Inbox List */}
          <div className="w-full lg:w-1/3 border-r border-border overflow-y-auto bg-background/50 flex flex-col">
            {filteredMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <MailOpen size={48} className="mb-4 opacity-20" />
                <p>No messages found.</p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.isRead) handleToggleRead(msg);
                  }}
                  className={`flex flex-col items-start p-4 border-b border-border text-left transition-colors ${selectedMessage?.id === msg.id ? 'bg-muted' : 'hover:bg-muted/50'} ${!msg.isRead ? 'bg-blue-500/5 dark:bg-blue-500/10' : ''}`}
                >
                  <div className="flex justify-between w-full mb-1">
                    <span className={`text-sm truncate ${!msg.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`text-sm truncate w-full mb-1 ${!msg.isRead ? 'font-semibold text-foreground' : 'text-foreground/70'}`}>
                    {msg.subject}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-1 w-full">
                    {msg.content}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Message Reader */}
          <div className="hidden lg:flex flex-1 flex-col overflow-y-auto">
            {selectedMessage ? (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="p-6 border-b border-border flex justify-between items-start bg-background/30">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{selectedMessage.name}</span>
                      <span>&lt;<a href={`mailto:${selectedMessage.email}`} className="hover:underline">{selectedMessage.email}</a>&gt;</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      title={selectedMessage.isRead ? "Mark as unread" : "Mark as read"}
                      onClick={() => handleToggleRead(selectedMessage)}
                      className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {selectedMessage.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                    </button>
                    <button 
                      title="Delete message"
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-8 flex-1">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/80">
                    {selectedMessage.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Mail size={48} className="mb-4 opacity-20" />
                <p>Select a message to read.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
