import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  Shirt, 
  Truck, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  MessageCircle, 
  Sparkles,
  Clock,
  Wand2,
  Lightbulb,
  Moon,
  Sun,
  Mail,
  Menu,
  X,
  Bot,
  Send,
  User,
  Info,
  Download 
} from 'lucide-react';

import homelaundryImage from './assets/homelaundry.jpg'; 

// --- 1. KONFIGURASI UTAMA ---
const APP_DATA = {
  companyName: "Muda Laundry",
  companySlogan: "Laundry Mudah, di Muda Laundry!",
  whatsappNumber: "6281358534557", 
  email: "warohmuda71@gmail.com",
  phoneDisplay: "+62 822-3126-1002", 
  address: "Midodaren RT03 RW08, Dawuhan, Kademangan, Blitar",
  prices: {
    cuciKering: 4000,
    cuciSetrika: 5000,
    setrikaSaja: 3500,
    cuciKarpet: 8500,
    cuciSepatu: 15000,
    cuciBoneka: 15000
  },
  apkFilename: "muda-laundry.apk"
};

// --- GEMINI API CONFIG ---
// [FIX] Menggunakan variabel manual agar tidak error "import.meta" di preview
// Silakan paste API Key kamu di dalam tanda kutip di bawah ini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

const callGemini = async (prompt, systemInstruction = "") => {
  if (!apiKey) return "⚠️ API Key belum disetting. Cek kodingan App.jsx baris 55.";

  try {
    const finalPrompt = systemInstruction ? `${systemInstruction}\n\nUser: ${prompt}` : prompt;
    
    // Menggunakan model gemini-2.5-flash-lite yang lebih ringan dan cepat
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }]
        })
      }
    );
    
    const data = await response.json();
    if (data.error) return `Error: ${data.error.message}`;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, AI sedang bingung.";
  } catch (error) {
    return "Gagal koneksi ke AI. Pastikan internet lancar.";
  }
};

// --- DATA SERVICES ---
const SERVICES = [
  {
    id: 1,
    name: 'Cuci Kering',
    slug: 'cuci-kering',
    desc: 'Pakaian dicuci bersih, dikeringkan, dan dilipat rapi. Wangi tahan lama.',
    price: APP_DATA.prices.cuciKering, 
    unit: 'kg',
    icon: <Waves className="w-6 h-6" />,
    category: 'daily'
  },
  {
    id: 2,
    name: 'Cuci Setrika',
    slug: 'cuci-setrika',
    desc: 'Layanan komplit. Cuci bersih, kering, setrika, siap pakai.',
    price: APP_DATA.prices.cuciSetrika, 
    unit: 'kg',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'daily'
  },
  {
    id: 3,
    name: 'Setrika Saja',
    slug: 'setrika-saja',
    desc: 'Pakaian kusut jadi rapi seketika dengan setrika professional.',
    price: APP_DATA.prices.setrikaSaja,
    unit: 'kg',
    icon: <Shirt className="w-6 h-6" />,
    category: 'daily'
  },
  {
    id: 4,
    name: 'Cuci Karpet',
    slug: 'cuci-karpet',
    desc: 'Membersihkan debu dan noda membandel pada karpet kesayangan.',
    price: APP_DATA.prices.cuciKarpet,
    unit: 'meter',
    icon: <LayersIcon className="w-6 h-6" />,
    category: 'item'
  },
  {
    id: 5,
    name: 'Cuci Sepatu',
    slug: 'cuci-sepatu',
    desc: 'Deep cleaning untuk semua jenis sepatu.',
    price: APP_DATA.prices.cuciSepatu,
    unit: 'pasang',
    icon: <FootprintsIcon className="w-6 h-6" />,
    category: 'item'
  },
  {
    id: 6,
    name: 'Cuci Boneka',
    slug: 'cuci-boneka',
    desc: 'Boneka kembali fluffy dan higienis, aman untuk anak.',
    price: APP_DATA.prices.cuciBoneka,
    unit: 'pcs',
    icon: <SmileIcon className="w-6 h-6" />,
    category: 'item'
  }
];

// Helper Icons
function LayersIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>; }
function FootprintsIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8v5.5"/><path d="M14 13.5V8c0-4.2 1.63-6 3.5-6 3.01 0 4.47 3.28 4.5 6 .03 2.5-1 3.5-1 5.62V16"/><path d="M17 16h4v4h-4z"/><path d="M3 16h4v4H3z"/></svg>; }
function SmileIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>; }

// --- REUSABLE COMPONENTS ---

const GlassCard = ({ children, className = "", delay = 0, onClick }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay, type: "spring" }}
    className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700 shadow-xl rounded-3xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", icon, disabled = false }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30",
    secondary: "bg-white/50 hover:bg-white/80 text-slate-800 border border-white/50 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/50",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-slate-800",
    magic: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 dark:shadow-purple-900/30",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
    download: "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-500/30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
      {icon}
    </motion.button>
  );
};

// --- SPLASH SCREEN COMPONENT ---
const SplashScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse"></div>
        <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl shadow-blue-600/20 overflow-hidden p-2">
          <img src={homelaundryImage} alt="Muda Laundry Logo" className='w-full h-full object-cover rounded-2xl' />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2"
      >
        {APP_DATA.companyName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-500 dark:text-slate-400 text-sm font-medium"
      >
        Loading...
      </motion.p>
      
      <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-blue-600 rounded-full"
        />
      </div>
    </motion.div>
  );
};

// --- FLOATING CHATBOT ---
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Halo! Saya Asisten ${APP_DATA.companyName}. Ada yang bisa dibantu mengenai layanan kami?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const systemInstruction = `Kamu adalah Customer Service AI untuk ${APP_DATA.companyName} di Blitar. 
    Data Toko:
    - Nama: ${APP_DATA.companyName}
    - Alamat: ${APP_DATA.address}
    - WA: ${APP_DATA.phoneDisplay}
    - Layanan: Cuci Kering, Setrika, Karpet, Boneka, Sepatu.
    
    Gaya bahasa: Ramah, sopan, logat Jawa Timur dikit boleh (sopan), dan membantu.
    Tugas: Jawab pertanyaan user seputar layanan, harga (perkiraan), dan lokasi.
    Jangan menjawab hal di luar konteks laundry. Jawab pendek-pendek saja (max 2 kalimat).`;

    const reply = await callGemini(userMsg, systemInstruction);
    
    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold">Asisten Toko</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950 h-80">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-500 animate-pulse">
                    Sedang mengetik...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

// --- PAGES COMPONENTS ---

const StainExpert = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const result = await callGemini(
      query, 
      "Kamu adalah ahli noda laundry. Berikan tips singkat (max 3 kalimat) cara penanganan awal noda sebelum dibawa ke laundry. Bahasa santai Indonesia."
    );
    setAnswer(result);
    setLoading(false);
  };

  return (
    <section className="px-4 py-10">
      <GlassCard className="max-w-4xl mx-auto !bg-indigo-50/60 dark:!bg-indigo-950/30 !border-indigo-200 dark:!border-indigo-800">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-3">
              <Sparkles size={14} />
              <span>Fitur Baru AI</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Konsultasi Noda Gratis</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Baju kena tinta atau saus? Jangan panik! Tanya AI kami untuk pertolongan pertama.
            </p>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: Baju putih saya kena tumpahan kopi..."
                className="w-full p-4 rounded-2xl border border-indigo-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-32"
              />
              <div className="absolute bottom-3 right-3">
                <Button 
                  variant="magic" 
                  onClick={handleAsk} 
                  disabled={loading || !query}
                  className="!py-2 !px-4 !text-sm"
                  icon={loading ? <div className="animate-spin">⌛</div> : <Wand2 size={16} />}
                >
                  {loading ? 'Menganalisa...' : 'Tanya Solusi'}
                </Button>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {answer && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                  <Lightbulb size={20} />
                  <h3 className="font-bold">Saran Ahli:</h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">"{answer}"</p>
                <button onClick={() => setAnswer('')} className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline">Tutup Saran</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </section>
  );
};

const LandingPage = ({ onNavigate, onDirectOrder }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/${APP_DATA.apkFilename}`; 
    link.download = APP_DATA.apkFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-12 pb-20">
      <section className="relative pt-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-2"
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs md:text-sm font-bold border border-blue-200 dark:border-blue-800 backdrop-blur-sm">
              ✨ {APP_DATA.companySlogan}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tight"
          >
            {APP_DATA.companyName.split(' ')[0]} <span className="text-blue-600 dark:text-blue-400">{APP_DATA.companyName.split(' ')[1]}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Serahkan pakaian kotor Anda pada ahlinya. 
            Kami merawat pakaian Anda seperti ibu merawat anaknya. 
            Wangi, rapi, dan higienis.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center pt-4"
          >
            <Button onClick={() => onNavigate('catalog')} icon={<ChevronRight size={20} />}>
              Pesan Sekarang
            </Button>
          </motion.div>
        </div>
      </section>

      {/* --- DOWNLOAD APP SECTION --- */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="!bg-gradient-to-r from-blue-600 to-indigo-600 !border-none text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-bold mb-2">Lebih Hemat di Aplikasi! 📱</h3>
                <p className="text-blue-100 text-sm md:text-base">Download aplikasi {APP_DATA.companyName} sekarang. Dapatkan notifikasi cucian selesai secara real-time!</p>
              </div>
              <Button 
                variant="download" 
                onClick={handleDownload}
                icon={<Download size={20} />}
              >
                Download .APK
              </Button>
            </div>
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
          </GlassCard>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Layanan Unggulan</h2>
            <button onClick={() => onNavigate('catalog')} className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">Lihat Semua</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.slice(0, 3).map((service, index) => (
              <GlassCard 
                key={service.id} 
                delay={index * 0.1} 
                onClick={() => onDirectOrder(service)} 
                className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl w-fit text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{service.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Rp {service.price.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">/{service.unit}</span></span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Pesan &rarr;</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
      
      <StainExpert />

      <section className="px-4 py-10">
        <GlassCard className="max-w-4xl mx-auto !bg-blue-600/90 dark:!bg-blue-800/80 !border-blue-400 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Clock className="w-8 h-8 mx-auto opacity-80" />
              <h4 className="font-bold text-lg">Cepat & Tepat</h4>
              <p className="text-blue-100 text-sm">Waktu pengerjaan terjamin sesuai janji.</p>
            </div>
            <div className="space-y-2">
              <Truck className="w-8 h-8 mx-auto opacity-80" />
              <h4 className="font-bold text-lg">Antar Jemput</h4>
              <p className="text-blue-100 text-sm">Kami jemput pakaian kotor, antar yang bersih.</p>
            </div>
            <div className="space-y-2">
              <Sparkles className="w-8 h-8 mx-auto opacity-80" />
              <h4 className="font-bold text-lg">Premium Quality</h4>
              <p className="text-blue-100 text-sm">Deterjen berkualitas dan setrika profesional.</p>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

const AboutPage = ({ onBack }) => (
  <div className="min-h-screen px-4 pt-6 pb-20">
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
          <ArrowLeft className="text-slate-700 dark:text-slate-200" />
        </button>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Tentang Kami</h1>
      </div>
      <GlassCard>
        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>{APP_DATA.companyName}</strong> adalah layanan laundry modern di {APP_DATA.address.split(',')[3]}, Blitar yang lahir dari semangat memberikan solusi kebersihan terbaik bagi masyarakat pedesaan. Nama "Muda" terinspirasi dari semangat pelayanan yang selalu fresh dan cepat.
          </p>
          <p>
            Kami menggabungkan ketulusan layanan khas pedesaan dengan teknologi modern. Menggunakan deterjen ramah lingkungan, setrika uap/listrik profesional, dan manajemen pesanan digital, kami memastikan setiap helai pakaian Anda diperlakukan istimewa.
          </p>
          <p>
            Visi kami sederhana: Membuat warga Dawuhan dan sekitarnya tampil rapi dan percaya diri tanpa repot mencuci.
          </p>
        </div>
      </GlassCard>
    </div>
  </div>
);

const ContactPage = ({ onBack }) => (
  <div className="min-h-screen px-4 pt-6 pb-20">
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
          <ArrowLeft className="text-slate-700 dark:text-slate-200" />
        </button>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Hubungi Kami</h1>
      </div>
      <div className="grid gap-6">
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">WhatsApp</h3>
            <p className="text-slate-500 dark:text-slate-400">{APP_DATA.phoneDisplay}</p>
          </div>
          <Button variant="outline" className="ml-auto" onClick={() => window.open(`https://wa.me/${APP_DATA.whatsappNumber}`, '_blank')}>Chat</Button>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Email</h3>
            <p className="text-slate-500 dark:text-slate-400">{APP_DATA.email}</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-full">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Alamat</h3>
            <p className="text-slate-500 dark:text-slate-400">{APP_DATA.address}</p>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
);

const CatalogPage = ({ onSelectService, onBack }) => (
  <div className="min-h-screen px-4 pt-6 pb-20">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
          <ArrowLeft className="text-slate-700 dark:text-slate-200" />
        </button>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Pilih Layanan</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service, index) => (
          <GlassCard key={service.id} delay={index * 0.05} className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{service.name}</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{service.desc}</p>
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  Rp {service.price.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-400">/{service.unit}</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <Button onClick={() => onSelectService(service)} className="!px-4 !py-2 !text-sm !rounded-xl">Pilih</Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </div>
);

const OrderPage = ({ service, onBack }) => {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isDelivery, setIsDelivery] = useState(false); 
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState(''); 
  const [note, setNote] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  const total = qty * service.price;

  const generateMagicNote = async () => {
    setIsGeneratingNote(true);
    const deliveryMode = isDelivery ? 'dijemput' : 'diantar sendiri';
    const result = await callGemini(
      `Buatkan 1 kalimat pesan sopan pelanggan ke laundry untuk: ${service.name} ${qty}${service.unit}, ${deliveryMode}.
      STRICT RULE: JANGAN ada kata pengantar seperti "Tentu", "Berikut". Langsung output kalimat pesannya saja.`,
      "Kamu adalah asisten penulis pesan singkat."
    );
    setNote(result);
    setIsGeneratingNote(false);
  };

  const handleOrder = () => {
    const phoneNumber = APP_DATA.whatsappNumber; 
    const deliveryText = isDelivery ? "Antar Jemput (Kurir Laundry)" : "Antar & Ambil Sendiri";
    
    let message = `*Halo ${APP_DATA.companyName}!* 👋%0ASaya mau pesan layanan baru nih.%0A%0A`;
    message += `📋 *Detail Pesanan:*%0A`;
    message += `Layanan: ${service.name}%0A`;
    message += `Jumlah: ${qty} ${service.unit}%0A`;
    message += `Estimasi Harga: Rp ${total.toLocaleString('id-ID')}%0A%0A`;
    message += `👤 *Data Pelanggan:*%0A`;
    message += `Nama: ${name}%0A`;
    message += `Tgl ${isDelivery ? 'Penjemputan' : 'Pengantaran'}: ${date}%0A`;
    
    if (isDelivery) {
       message += `Pertanyaan: Apakah bisa jemput di tanggal tersebut?%0A`;
    }
    
    message += `Metode: ${deliveryText}%0A`;
    message += `Alamat: ${address}%0A`;
    message += `Kecamatan: ${district}%0A`;
    
    if (note) {
      message += `Catatan: ${note}%0A`;
    }
    
    message += `%0ATerima kasih!`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
            <ArrowLeft className="text-slate-700 dark:text-slate-200" />
          </button>
          <div>
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Detail Pesanan</h1>
             <p className="text-slate-500 dark:text-slate-400 text-sm">{service.name}</p>
          </div>
        </div>

        <GlassCard className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Perkiraan Jumlah ({service.unit})
            </label>
            <div className="flex items-center gap-4">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn">-</button>
              <input 
                type="number" 
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-center font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => setQty(qty + 1)} className="qty-btn">+</button>
            </div>
            <style jsx>{`
              .qty-btn {
                @apply w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 transition-colors;
              }
            `}</style>
            <p className="text-xs text-slate-400">*Berat pasti akan ditimbang ulang di lokasi</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Atas Nama</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal {isDelivery ? 'Penjemputan' : 'Pengantaran'}
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin size={18} /> Lokasi & Pengiriman
            </h3>
            
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex relative">
              <motion.div 
                initial={false}
                animate={{ x: isDelivery ? '100%' : '0%' }}
                className="absolute w-1/2 h-[calc(100%-8px)] bg-white dark:bg-slate-600 shadow-sm rounded-lg top-1 left-1"
              />
              <button onClick={() => setIsDelivery(false)} className={`flex-1 relative z-10 py-2 text-sm font-semibold transition-colors ${!isDelivery ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Antar Sendiri</button>
              <button onClick={() => setIsDelivery(true)} className={`flex-1 relative z-10 py-2 text-sm font-semibold transition-colors ${isDelivery ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Antar Jemput</button>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap</label>
              <textarea 
                rows="2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kecamatan</label>
              <input 
                type="text" 
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white"
              />
            </div>

             <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Catatan Tambahan</label>
                <button 
                  onClick={generateMagicNote}
                  disabled={isGeneratingNote}
                  className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-bold hover:text-purple-800 dark:hover:text-purple-300 disabled:opacity-50"
                >
                  <Sparkles size={12} />
                  {isGeneratingNote ? 'Menulis...' : 'Buatkan Pesan Ramah (AI)'}
                </button>
              </div>
              <textarea 
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white resize-none"
              />
            </div>
          </div>
        </GlassCard>

        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 pb-6 z-40"
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Perkiraan</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">Rp {total.toLocaleString('id-ID')}</p>
            </div>
            <Button 
              onClick={handleOrder} 
              className="!w-auto !px-6 !py-3 bg-[#25D366] hover:bg-[#1da851] !shadow-[#25D366]/30"
            >
              <MessageCircle className="w-5 h-5" />
              Pesan Sekarang
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedService, setSelectedService] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true); 

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'dark'; 
    }
    return 'dark';
  });

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  // THEME FIX
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSelectedService(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentView('order');
    window.scrollTo(0, 0);
  };

  const Background = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-200/40 dark:bg-cyan-900/20 blur-3xl animate-pulse delay-700" />
    </div>
  );

  return (
    <div className="font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-200 dark:selection:bg-blue-800 transition-colors duration-300">
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      
      <Background />
      <Chatbot />
      
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-sm rounded-2xl px-6 py-3 flex items-center justify-between transition-colors duration-300">
             <div onClick={() => handleNavigate('landing')} className="flex items-center gap-2 cursor-pointer">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white overflow-hidden">
                 <img src={homelaundryImage} alt="muda laundry logo" className='w-full h-full object-cover'/>
               </div>
               <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">{APP_DATA.companyName}</span>
             </div>
             
             {/* Desktop Menu */}
             <div className="hidden md:flex items-center gap-6">
                <button onClick={() => handleNavigate('about')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tentang</button>
                <button onClick={() => handleNavigate('catalog')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Layanan</button>
                <button onClick={() => handleNavigate('contact')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kontak</button>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-yellow-400 transition-all">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
             </div>

             {/* Mobile Burger */}
             <div className="md:hidden flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-yellow-400">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-800 dark:text-white">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
             </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-20 left-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 flex flex-col gap-2 md:hidden"
              >
                <button onClick={() => handleNavigate('about')} className="p-3 text-left font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Tentang Kami</button>
                <button onClick={() => handleNavigate('catalog')} className="p-3 text-left font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Daftar Layanan</button>
                <button onClick={() => handleNavigate('contact')} className="p-3 text-left font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Kontak</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage onNavigate={handleNavigate} onDirectOrder={handleSelectService} />
            </motion.div>
          )}

          {currentView === 'about' && (
             <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <AboutPage onBack={() => handleNavigate('landing')} />
             </motion.div>
          )}

          {currentView === 'contact' && (
             <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <ContactPage onBack={() => handleNavigate('landing')} />
             </motion.div>
          )}

          {currentView === 'catalog' && (
            <motion.div key="catalog" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CatalogPage onSelectService={handleSelectService} onBack={() => handleNavigate('landing')} />
            </motion.div>
          )}

          {currentView === 'order' && selectedService && (
             <motion.div key="order" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
               <OrderPage service={selectedService} onBack={() => handleNavigate('catalog')} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="px-4 mt-10 pb-10">
        <div className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-600">© 2025 {APP_DATA.companyName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}