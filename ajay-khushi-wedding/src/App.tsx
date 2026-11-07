import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Music2, VolumeX, Volume2, Heart, MapPin, CalendarDays, Clock3, Flower2, Menu, X, Send, Camera, Sparkles, Play, Pause, ChevronDown } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { wedding } from './config'

type Wish = { id: string; name: string; relationship: string; message: string; created_at?: string }
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
const localKey = 'ajay-khushi-wedding-wishes-v1'

function Ornament({ small = false }: { small?: boolean }) {
  return <div className={`ornament ${small ? 'ornament-small' : ''}`} aria-hidden="true"><span>✦</span><i /><span>❀</span><i /><span>✦</span></div>
}
function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><Ornament small />{subtitle && <p>{subtitle}</p>}</div>
}
function App() {
  const [opened, setOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [wishList, setWishList] = useState<Wish[]>([])
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [lightbox, setLightbox] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const events = useMemo(() => [
    { day: 'शुक्रवार · 20 नवंबर 2026', title: 'मेहंदी एवं संगीत', english: 'Mehendi & Sangeet', desc: 'Celebrate the beginning of our wedding festivities with music, dance, mehendi and happiness.', icon: '✿', time: 'समय एवं कार्यक्रम — आमंत्रण-पत्र के अनुसार' },
    { day: 'शनिवार · 21 नवंबर 2026', title: 'शुभ विवाह', english: 'The Wedding Ceremony', desc: 'Join us as two souls come together in the sacred bond of marriage with the blessings of our elders.', icon: '❋', time: 'शुभ विवाह — मंगलमय बेला' }
  ], [])
  const gallery = ['दूल्हा-दुल्हन की तस्वीर', 'मेहंदी समारोह', 'हल्दी की खुशियाँ', 'शुभ विवाह मंडप', 'फूलों की सजावट', 'परिवार के अनमोल पल']

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(wedding.weddingISO).getTime() - Date.now())
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60 })
    }
    tick(); const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const saved = localStorage.getItem(localKey)
    if (saved) { try { setWishList(JSON.parse(saved)) } catch { /* ignore malformed local demo data */ } }
    if (supabase) supabase.from('wishes').select('*').order('created_at', { ascending: false }).limit(30).then(({ data }) => { if (data) setWishList(data as Wish[]) })
  }, [])
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (musicOn && opened) audio.play().catch(() => setMusicOn(false))
    else audio.pause()
  }, [musicOn, opened])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openInvitation = () => {
    setOpened(true)
    if (audioRef.current) { audioRef.current.volume = 0.34; audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false)) }
    window.setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }), 500)
  }
  const toggleMusic = () => {
    if (!opened) return
    setMusicOn(v => !v)
  }
  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) { setNotice('कृपया अपना नाम और शुभकामना लिखें।'); return }
    const item: Wish = { id: crypto.randomUUID(), name: name.trim(), relationship: relationship.trim() || 'शुभचिंतक', message: message.trim(), created_at: new Date().toISOString() }
    if (supabase) {
      const { error } = await supabase.from('wishes').insert({ name: item.name, relationship: item.relationship, message: item.message })
      if (error) { setNotice('शुभकामना सेव नहीं हो सकी। कृपया पुनः प्रयास करें।'); return }
      const { data } = await supabase.from('wishes').select('*').order('created_at', { ascending: false }).limit(30)
      if (data) setWishList(data as Wish[])
    } else {
      const next = [item, ...wishList].slice(0, 30); setWishList(next); localStorage.setItem(localKey, JSON.stringify(next))
    }
    setName(''); setRelationship(''); setMessage(''); setNotice('आपकी शुभकामना के लिए हृदय से धन्यवाद! ❤️')
  }
  const scrollTo = (id: string) => { setMobileMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return <div className="site-shell">
    <audio ref={audioRef} src="/audio/wedding-instrumental.mp3" loop preload="none" />
    <AnimatePresence>
      {!opened && <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 1 }}>
        <div className="intro-frame"><div className="intro-corner tl">❧</div><div className="intro-corner tr">❧</div><div className="intro-corner bl">❧</div><div className="intro-corner br">❧</div>
          <div className="ganesha-seal">ॐ<br/><span>श्री गणेशाय नमः</span></div>
          <div className="intro-kicker">॥ मंगल परिणय निमंत्रण ॥</div>
          <div className="envelope-wrap"><div className="envelope"><div className="envelope-flap"/><div className="envelope-letter"><span>अ</span><small>शुभ विवाह</small></div><div className="envelope-seal">❀</div></div></div>
          <p className="intro-blessing">स्नेह, संस्कार और शुभाशीष के साथ</p>
          <h1 className="intro-names">अजय <b>♥</b> खुशी</h1>
          <p className="intro-date">20 & 21 नवंबर 2026</p>
          <button className="gold-button open-button" onClick={openInvitation}><span>OPEN WEDDING INVITATION</span><ChevronDown size={16}/></button>
          <p className="intro-hint"><Music2 size={13}/> शहनाई और ढोल की मधुर धुन सुनने के लिए आमंत्रण खोलें</p>
        </div>
      </motion.div>}
    </AnimatePresence>

    <header className="topbar"><button className="brand" onClick={() => scrollTo('home')}>A <span>♥</span> K <small>THE WEDDING</small></button>
      <nav className={mobileMenu ? 'nav-links show' : 'nav-links'}>
        {['home','story','events','venue','gallery','blessings'].map((id, i) => <button key={id} onClick={() => scrollTo(id)}>{['Home','Our Story','Events','Venue','Gallery','Blessings'][i]}</button>)}
      </nav>
      <div className="top-actions"><button className="music-toggle" onClick={toggleMusic} aria-label="Toggle music" title={musicOn ? 'Pause wedding music' : 'Play wedding music'}>{musicOn ? <Volume2 size={17}/> : <VolumeX size={17}/>}<span>{musicOn ? 'Music On' : 'Music Off'}</span></button><button className="menu-toggle" onClick={() => setMobileMenu(v => !v)} aria-label="Menu">{mobileMenu ? <X/> : <Menu/>}</button></div>
    </header>

    <main>
      <section id="home" className="hero">
        <div className="hero-texture"/>
        <div className="hero-content">
          <div className="hero-symbol">ॐ</div><p className="eyebrow">WITH THE BLESSINGS OF OUR ELDERS</p>
          <h1>अजय <span>♥</span> खुशी</h1><p className="hero-subtitle">Two Hearts, One Beautiful Journey</p>
          <Ornament/>
          <p className="hero-copy">With immense joy and the blessings of our families,<br/>we invite you to celebrate the beginning of our forever.</p>
          <div className="hero-date"><CalendarDays size={17}/> 20 — 21 NOVEMBER 2026</div>
          <button className="text-link" onClick={() => scrollTo('events')}>EXPLORE THE CELEBRATION <ChevronDown size={15}/></button>
        </div>
        <div className="hero-side-note">A CELEBRATION OF LOVE · FAMILY · TOGETHERNESS</div>
        <div className="petal petal-one">✿</div><div className="petal petal-two">❀</div><div className="petal petal-three">✽</div>
      </section>

      <section id="story" className="section story-section">
        <SectionTitle eyebrow="THE ROYAL UNION" title="Two Souls, One Journey" subtitle="A new chapter begins, woven with love, blessings and the promise of forever."/>
        <div className="couple-grid">
          <motion.article className="person-card" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="portrait-placeholder groom-placeholder"><span>अ</span><small>GROOM</small><Camera size={19}/></div><p className="person-label">THE GROOM</p><h3>{wedding.groom}</h3><p className="family-caption">सुपुत्र</p><p className="family-name">{wedding.groomParents}</p>
          </motion.article>
          <div className="couple-heart">♥</div>
          <motion.article className="person-card" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="portrait-placeholder bride-placeholder"><span>खु</span><small>BRIDE</small><Camera size={19}/></div><p className="person-label">THE BRIDE</p><h3>{wedding.bride}</h3><p className="family-caption">सुपुत्री</p><p className="family-name">{wedding.brideParents}</p>
          </motion.article>
        </div>
        <div className="family-note"><Flower2/><p>With the love and blessings of our grandparents, relatives and well-wishers, we request the honour of your gracious presence.</p><Flower2/></div>
      </section>

      <section className="date-band"><div className="date-band-inner"><span>॥ शुभ विवाह ॥</span><h2>Save The Date</h2><p>20 November 2026 <i>·</i> Mehendi & Sangeet</p><p>21 November 2026 <i>·</i> Wedding Ceremony</p><Ornament small/>
        <div className="countdown"><div><strong>{timeLeft.days}</strong><small>DAYS</small></div><b>:</b><div><strong>{String(timeLeft.hours).padStart(2,'0')}</strong><small>HOURS</small></div><b>:</b><div><strong>{String(timeLeft.minutes).padStart(2,'0')}</strong><small>MINUTES</small></div><b>:</b><div><strong>{String(timeLeft.seconds).padStart(2,'0')}</strong><small>SECONDS</small></div></div>
        <p className="countdown-caption">COUNTING DOWN TO OUR FOREVER</p>
      </div></section>

      <section id="events" className="section events-section">
        <SectionTitle eyebrow="THE WEDDING FESTIVITIES" title="Events & Celebrations" subtitle="Two beautiful days filled with traditions, laughter, music and blessings."/>
        <div className="event-list">{events.map((event, i) => <motion.article className="event-card" key={event.title} initial={{ opacity: 0, x: i % 2 ? 35 : -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65 }}>
          <div className="event-number">0{i+1}</div><div className="event-icon">{event.icon}</div><div className="event-details"><span className="event-day">{event.day}</span><h3>{event.title}</h3><p className="event-english">{event.english}</p><p>{event.desc}</p><div className="event-time"><Clock3 size={15}/>{event.time}</div></div><div className="event-stamp">शुभ<br/>मंगल</div>
        </motion.article>)}</div>
      </section>

      <section id="venue" className="venue-section">
        <div className="venue-inner"><div className="venue-copy"><p className="eyebrow">THE DESTINATION</p><h2>Where We Say<br/><em>“I Do”</em></h2><Ornament small/><p className="venue-label">WEDDING VENUE</p><h3>{wedding.venue}</h3><p className="venue-english">{wedding.venueEnglish}</p><a className="gold-button directions-button" href={wedding.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17}/> GET DIRECTIONS</a><p className="venue-disclaimer">Please verify the exact map pin and route with the family before travelling.</p></div>
          <div className="venue-art"><div className="temple-arch"><div className="temple-dome">ॐ</div><div className="temple-pillars"><span/><div className="temple-door">शुभ<br/>विवाह</div><span/></div><div className="temple-steps"/></div><div className="venue-flower">✿</div></div>
        </div>
      </section>

      <section id="gallery" className="section gallery-section"><SectionTitle eyebrow="CHERISHED MOMENTS" title="A Gallery of Memories" subtitle="A few spaces waiting to be filled with your family's own beautiful photographs."/>
        <div className="gallery-grid">{gallery.map((label, i) => <button className={`gallery-tile tile-${i+1}`} key={label} onClick={() => setLightbox(i)}><div className="gallery-placeholder"><Camera size={25}/><span>{label}</span><small>PHOTO TO BE ADDED</small></div><b>{label}</b></button>)}</div>
      </section>

      <section id="blessings" className="blessings-section"><div className="blessings-inner"><SectionTitle eyebrow="BLESSINGS & LOVE NOTES" title="अपना आशीर्वाद एवं शुभकामनाएं दें" subtitle="Your kind words and blessings will make our celebration even more special."/>
        <div className="wishes-layout"><form className="wish-form" onSubmit={submitWish}><label>आपका नाम / Your Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" maxLength={70}/></label><label>रिश्ता / Relationship<input value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="e.g. Friend, Uncle, Cousin" maxLength={70}/></label><label>शुभकामनाएं / Your Wishes<textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your blessings for the couple..." rows={4} maxLength={500}/></label><button className="gold-button submit-button" type="submit"><Send size={16}/> SEND YOUR BLESSINGS</button>{notice && <p className="form-notice" role="status">{notice}</p>}<p className="demo-note">{supabase ? 'Connected to Supabase · Wishes are shared' : 'Demo mode · Wishes are saved in this browser only'}</p></form>
          <div className="wish-wall"><div className="wish-wall-heading"><Heart size={18}/><span>WALL OF BLESSINGS</span><small>{wishList.length} wishes</small></div>{wishList.length === 0 ? <div className="empty-wishes"><span>❀</span><p>Be the first to leave a blessing for Ajay & Khushi.</p></div> : wishList.map(w => <article className="wish-card" key={w.id}><div className="wish-avatar">{w.name.charAt(0).toUpperCase()}</div><div><h4>{w.name}</h4><small>{w.relationship}</small><p>“{w.message}”</p></div></article>)}</div>
        </div>
      </div></section>
    </main>
    <footer className="footer"><div className="footer-mandala">✺</div><p className="eyebrow">WITH LOVE & BLESSINGS</p><h2>अजय <span>♥</span> खुशी</h2><Ornament small/><p>आपकी उपस्थिति एवं आशीर्वाद हमारे लिए अमूल्य हैं।</p><p className="footer-made">MADE WITH LOVE & BLESSINGS</p><small>20 — 21 NOVEMBER 2026</small></footer>
    <button className="floating-music" onClick={toggleMusic} aria-label={musicOn ? 'Pause wedding music' : 'Play wedding music'}>{musicOn ? <Pause size={19}/> : <Play size={19}/>}<span>{musicOn ? 'PAUSE MUSIC' : 'PLAY MUSIC'}</span></button>
    <AnimatePresence>{lightbox !== null && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}><button className="lightbox-close" aria-label="Close"><X/></button><div className="lightbox-content" onClick={e => e.stopPropagation()}><Camera size={40}/><h3>{gallery[lightbox]}</h3><p>Upload the family's original photograph to replace this placeholder.</p></div></motion.div>}</AnimatePresence>
  </div>
}
export default App
