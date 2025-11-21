import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  Shirt, 
  Scissors, 
  Truck, 
  Phone, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Clock,
  Wand2,
  Lightbulb,
  Moon,
  Sun,
  Mail
} from 'lucide-react';

// --- 1. KONFIGURASI UTAMA (UBAH DATA DI SINI) ---
// Ini adalah "Pusat Kontrol" data website lo. Ganti value di sini, otomatis berubah di semua halaman.
const APP_DATA = {
  companyName: "Muda Laundry",
  companySlogan: "Laundry Muda-h berkualitas, ya di Muda Laundry!",
  
  // Kontak
  whatsappNumber: "6288805385353", // Format internasional tanpa '+' (contoh: 628...)
  email: "halo@mudalaundry.com",
  phoneDisplay: "+6288805385353", // Untuk tampilan di UI
  address: "Midodaren RT03 RW08, Dawuhan, Kademangan, Blitar",
  
  // Harga Dasar (Rupiah)
  prices: {
    cuciKering: 9999,
    cuciSetrika: 14999,
    setrikaSaja: 9999,
    cuciKarpet: 19999,
    cuciSepatu: 24999,
    cuciBoneka: 14999
  }
};

// --- GEMINI API CONFIG ---
const apiKey = import.meta.env.GEMINI_API // API Key akan diisi otomatis oleh env

const callGemini = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, AI sedang istirahat sejenak.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Gagal terhubung ke asisten pintar.";
  }
};

// --- DATA SERVICES (MENGAMBIL DARI APP_DATA) ---


// Helper Icons
const LayersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
);
const FootprintsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8v5.5"/><path d="M14 13.5V8c0-4.2 1.63-6 3.5-6 3.01 0 4.47 3.28 4.5 6 .03 2.5-1 3.5-1 5.62V16"/><path d="M17 16h4v4h-4z"/><path d="M3 16h4v4H3z"/></svg>
);
const SmileIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
);

const SERVICES = [
  {
    id: 1,
    name: 'Cuci Kering',
    slug: 'cuci-kering',
    desc: 'Pakaian dicuci bersih, dikeringkan, dan dilipat rapi. Wangi tahan lama.',
    price: APP_DATA.prices.cuciKering, // Mengambil dari variable
    unit: 'kg',
    icon: <Waves className="w-6 h-6" />,
    category: 'daily'
  },
  {
    id: 2,
    name: 'Cuci Setrika',
    slug: 'cuci-setrika',
    desc: 'Layanan komplit. Cuci bersih, kering, setrika uap, siap pakai.',
    price: APP_DATA.prices.cuciSetrika, 
    unit: 'kg',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'daily'
  },
  {
    id: 3,
    name: 'Setrika Saja',
    slug: 'setrika-saja',
    desc: 'Pakaian kusut jadi rapi seketika dengan setrika uap professional.',
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
    desc: 'Deep cleaning untuk sepatu kets, boots, atau pantofel.',
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
// --- COMPONENTS ---

// 1. Atomic: Glass Card
const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay, type: "spring" }}
    className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700 shadow-xl rounded-3xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// 2. Atomic: Button
const Button = ({ children, onClick, variant = 'primary', className = "", icon, disabled = false }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30",
    secondary: "bg-white/50 hover:bg-white/80 text-slate-800 border border-white/50 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/50",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-slate-800",
    magic: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 dark:shadow-purple-900/30"
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

// --- NEW FEATURE: AI Stain Expert ---
const StainExpert = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const prompt = `Kamu adalah ahli laundry profesional dan ramah di desa. Pelanggan bertanya tentang masalah noda: "${query}". 
    Berikan tips pertolongan pertama yang singkat (maksimal 3 kalimat) dalam bahasa Indonesia yang santai namun sopan sebelum mereka mengirimkannya ke laundry. 
    Akhiri dengan menyarankan untuk membawa ke ${APP_DATA.companyName} jika ragu. Jangan gunakan markdown bold/italic.`;
    
    const result = await callGemini(prompt);
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
              Baju kena tinta atau saus? Jangan panik! Tanya AI kami untuk pertolongan pertama sebelum dibawa ke sini.
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
                <button 
                  onClick={() => setAnswer('')}
                  className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                >
                  Tutup Saran
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </section>
  );
};

// --- MAIN PAGE SECTIONS ---

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="inline-block mb-2"
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold border border-blue-200 dark:border-blue-800 backdrop-blur-sm">
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
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
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

      {/* Services Preview (Glass Cards) */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Layanan Unggulan</h2>
            <button onClick={() => onNavigate('catalog')} className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">Lihat Semua</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.slice(0, 3).map((service, index) => (
              <GlassCard key={service.id} delay={index * 0.1} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl w-fit text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{service.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Rp {service.price.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">/{service.unit}</span></span>
                </div>
              </GlassCard>
            ))}
          </div>
          
          <div className="mt-8 text-center">
             <Button variant="secondary" onClick={() => onNavigate('catalog')}>
              Lihat Layanan Lainnya
            </Button>
          </div>
        </div>
      </section>
      
      {/* New Feature: Stain Expert */}
      <StainExpert />

      {/* Why Us / Summary */}
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
              <p className="text-blue-100 text-sm">Deterjen berkualitas dan setrika uap.</p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Contact & Footer */}
      <footer className="px-4 mt-10">
        <div className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Hubungi Kami</h2>
          <p className="text-slate-500 dark:text-slate-400">Punya pertanyaan khusus? Chat kami aja!</p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 text-slate-600 dark:text-slate-400 text-sm my-6">
             <div className="flex items-center justify-center gap-2">
               <MapPin size={16} />
               <span>{APP_DATA.address}</span>
             </div>
             <div className="flex items-center justify-center gap-2">
               <Phone size={16} />
               <span>{APP_DATA.phoneDisplay}</span>
             </div>
             <div className="flex items-center justify-center gap-2">
               <Mail size={16} />
               <span>{APP_DATA.email}</span>
             </div>
          </div>

          <div className="pb-10">
            <p className="text-xs text-slate-400 dark:text-slate-600">© 2025 {APP_DATA.companyName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CatalogPage = ({ onSelectService, onBack }) => {
  return (
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
                  <Button 
                    onClick={() => onSelectService(service)} 
                    className="!px-4 !py-2 !text-sm !rounded-xl"
                  >
                    Pilih
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderPage = ({ service, onBack }) => {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isDelivery, setIsDelivery] = useState(false); 
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState(''); 
  const [note, setNote] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  // Calculator
  const total = qty * service.price;

  // AI Note Generator
  const generateMagicNote = async () => {
    setIsGeneratingNote(true);
    const deliveryMode = isDelivery ? 'dijemput' : 'diantar sendiri';
    const prompt = `Buatkan satu kalimat pesan tambahan yang sangat sopan, ramah, dan terdengar akrab (boso jowo dikit gapapa tapi umum) dari pelanggan laundry ke pemilik laundry.
    Konteks: Pelanggan memesan ${service.name} sebanyak ${qty} ${service.unit}, metode ${deliveryMode}.
    Contoh output: "Mohon dibantu ya Mbak, ini baju kesayangan saya soalnya hehe."
    Jangan pakai tanda kutip di output.`;

    const result = await callGemini(prompt);
    setNote(result);
    setIsGeneratingNote(false);
  };

  // Generate WhatsApp Link
  const handleOrder = () => {
    const phoneNumber = APP_DATA.whatsappNumber; // Menggunakan variable
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
        {/* Header */}
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
          
          {/* Quantity Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Perkiraan Jumlah ({service.unit})
            </label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 transition-colors"
              >-</button>
              <input 
                type="number" 
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-center font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 transition-colors"
              >+</button>
            </div>
            <p className="text-xs text-slate-400">*Berat pasti akan ditimbang ulang di lokasi</p>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Atas Nama</label>
              <input 
                type="text" 
                placeholder="Contoh: Ibu Siti"
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
              {isDelivery && date && (
                 <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                   Kami akan konfirmasi ketersediaan kurir pada tanggal ini via WA.
                 </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin size={18} /> Lokasi & Pengiriman
            </h3>
            
            {/* Delivery Switch */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex relative">
              <motion.div 
                initial={false}
                animate={{ x: isDelivery ? '100%' : '0%' }}
                className="absolute w-1/2 h-[calc(100%-8px)] bg-white dark:bg-slate-600 shadow-sm rounded-lg top-1 left-1"
              />
              
              <button 
                onClick={() => setIsDelivery(false)}
                className={`flex-1 relative z-10 py-2 text-sm font-semibold transition-colors ${!isDelivery ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Antar Sendiri
              </button>
              <button 
                onClick={() => setIsDelivery(true)}
                className={`flex-1 relative z-10 py-2 text-sm font-semibold transition-colors ${isDelivery ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Antar Jemput
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap</label>
              <textarea 
                rows="2"
                placeholder="Nama jalan, nomor rumah, patokan..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kecamatan</label>
              <input 
                type="text" 
                placeholder="Kecamatan domisili..."
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white"
              />
            </div>

            {/* AI Note Feature */}
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
                placeholder="Ada permintaan khusus? (Contoh: Jangan disetrika terlalu panas)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white resize-none"
              />
            </div>
          </div>

        </GlassCard>

        {/* Sticky Bottom Action */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 pb-6 z-50"
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

// --- MAIN APP ORCHESTRATOR ---

export default function App() {
  // View State: 'landing' | 'catalog' | 'order'
  const [currentView, setCurrentView] = useState('landing');
  const [selectedService, setSelectedService] = useState(null);

  // Theme State
  const [theme, setTheme] = useState(() => {
    // Priority: 1. LocalStorage, 2. System Pref, 3. Default to Dark (if system unreadable)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
      // Fallback if system detection fails or is strictly requested to be dark default otherwise
      return 'dark'; 
    }
    return 'dark';
  });

  // Apply theme to HTML element
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

  // Handle Navigation
  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentView('order');
    window.scrollTo(0, 0);
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    setSelectedService(null);
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  // Background Animation Elements (Blob shapes)
  const Background = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-200/40 dark:bg-cyan-900/20 blur-3xl animate-pulse delay-700" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl animate-pulse delay-1000" />
    </div>
  );

  return (
    <div className="font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-200 dark:selection:bg-blue-800 transition-colors duration-300">
      <Background />
      
      {/* Navbar (Sticky Glass) */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-sm rounded-2xl px-6 py-3 flex items-center justify-between transition-colors duration-300">
             <div 
               onClick={() => setCurrentView('landing')} 
               className="flex items-center gap-2 cursor-pointer"
             >
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                 <Waves size={18} />
               </div>
               <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">{APP_DATA.companyName}</span>
             </div>
             
             <div className="flex items-center gap-4">
               {/* Desktop Menu */}
               {currentView === 'landing' && (
                 <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                   <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tentang</a>
                   <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Layanan</a>
                   <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kontak</a>
                 </div>
               )}

               {/* Theme Toggle */}
               <button 
                 onClick={toggleTheme}
                 className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-yellow-400 transition-all"
                 title="Ganti Tema"
               >
                 {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </button>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LandingPage onNavigate={setCurrentView} />
            </motion.div>
          )}

          {currentView === 'catalog' && (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CatalogPage onSelectService={handleSelectService} onBack={handleBackToHome} />
            </motion.div>
          )}

          {currentView === 'order' && selectedService && (
             <motion.div 
             key="order"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 20 }}
           >
             <OrderPage service={selectedService} onBack={handleBackToCatalog} />
           </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}