import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Music2, VolumeX, Volume2, MapPin, CalendarDays, Clock3, Flower2, Menu, X, Play, Pause, ChevronDown } from 'lucide-react'
import { wedding } from './config'


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
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const audioRef = useRef<HTMLAudioElement>(null)
  const events = useMemo(() => [
    { day: 'शुक्रवार · 20 नवंबर 2026', title: 'मेहंदी एवं संगीत', english: 'Mehendi & Sangeet', desc: 'Celebrate the beginning of our wedding festivities with music, dance, mehendi and happiness.', icon: '✿', time: 'समय एवं कार्यक्रम — आमंत्रण-पत्र के अनुसार' },
    { day: 'शनिवार · 21 नवंबर 2026', title: 'शुभ विवाह', english: 'The Wedding Ceremony', desc: 'Join us as two souls come together in the sacred bond of marriage with the blessings of our elders.', icon: '❋', time: 'शुभ विवाह — मंगलमय बेला' }
  ], [])

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(wedding.weddingISO).getTime() - Date.now())
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60 })
    }
    tick(); const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (musicOn && opened) audio.play().catch(() => setMusicOn(false))
    else audio.pause()
  }, [musicOn, opened])

  const openInvitation = () => {
    setOpened(true)
    if (audioRef.current) { audioRef.current.volume = 0.34; audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false)) }
    window.setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }), 500)
  }
  const toggleMusic = () => {
    if (!opened) return
    setMusicOn(v => !v)
  }
  const scrollTo = (id: string) => { setMobileMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return <div className="site-shell">
    <audio ref={audioRef} src="/audio/ranjha.mp3" loop preload="none" />
    <AnimatePresence>
      {!opened && <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 1 }}>
        <div className="intro-frame"><div className="intro-corner tl">❧</div><div className="intro-corner tr">❧</div><div className="intro-corner bl">❧</div><div className="intro-corner br">❧</div>
          <div className="ganesha-seal">ॐ<br/><span>श्री गणेशाय नमः</span></div>
          <div className="intro-kicker">॥ मंगल परिणय निमंत्रण ॥</div>
          <div className="envelope-wrap"><div className="envelope"><div className="envelope-flap"/><div className="envelope-letter"><span>अ</span><small>शुभ विवाह</small></div><div className="envelope-seal">❀</div></div></div>
          <p className="intro-blessing">स्नेह, संस्कार और शुभाशीष के साथ</p>
          <h1 className="intro-names">खुशी <b>♥</b> अजय</h1>
          <p className="intro-date">20 & 21 नवंबर 2026</p>
          <button className="gold-button open-button" onClick={openInvitation}><span>OPEN WEDDING INVITATION</span><ChevronDown size={16}/></button>
          <p className="intro-hint"><Music2 size={13}/> Ranjha गाने के साथ इस खास पल का आनंद लें</p>
        </div>
      </motion.div>}
    </AnimatePresence>

    <header className="topbar"><button className="brand" onClick={() => scrollTo('home')}>A <span>♥</span> K <small>THE WEDDING</small></button>
      <nav className={mobileMenu ? 'nav-links show' : 'nav-links'}>
        {['home','story','events','venue'].map((id, i) => <button key={id} onClick={() => scrollTo(id)}>{['Home','Our Story','Events','Venue'][i]}</button>)}
      </nav>
      <div className="top-actions"><button className="music-toggle" onClick={toggleMusic} aria-label="Toggle music" title={musicOn ? 'Pause wedding music' : 'Play wedding music'}>{musicOn ? <Volume2 size={17}/> : <VolumeX size={17}/>}<span>{musicOn ? 'Music On' : 'Music Off'}</span></button><button className="menu-toggle" onClick={() => setMobileMenu(v => !v)} aria-label="Menu">{mobileMenu ? <X/> : <Menu/>}</button></div>
    </header>

    <main>
      <section id="home" className="hero">
        <div className="hero-texture"/>
        <div className="hero-content">
          <div className="hero-symbol">ॐ</div><p className="eyebrow">WITH THE BLESSINGS OF OUR ELDERS</p>
          <h1>खुशी <span>♥</span> अजय</h1><p className="hero-subtitle">Two Hearts, One Beautiful Journey</p>
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
            <div className="portrait-placeholder groom-placeholder"><span>अ</span><small>GROOM</small></div><p className="person-label">THE GROOM</p><h3>{wedding.groom}</h3><p className="family-caption">सपरिवार</p><p className="family-name">{wedding.groomParents}</p>
          </motion.article>
          <div className="couple-heart">♥</div>
          <motion.article className="person-card" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="portrait-placeholder bride-placeholder"><span>खु</span><small>BRIDE</small></div><p className="person-label">THE BRIDE</p><h3>{wedding.bride}</h3><p className="family-caption">सपरिवार</p><p className="family-name">{wedding.brideParents}</p>
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

    </main>
    <footer className="footer"><div className="footer-mandala">✺</div><p className="eyebrow">WITH LOVE & BLESSINGS</p><h2>खुशी <span>♥</span> अजय</h2><Ornament small/><p>आपकी उपस्थिति एवं आशीर्वाद हमारे लिए अमूल्य हैं।</p><small>20 — 21 NOVEMBER 2026</small><p className="footer-made">Designed By ❤️ Mithu</p></footer>
    <button className="floating-music" onClick={toggleMusic} aria-label={musicOn ? 'Pause wedding music' : 'Play wedding music'}>{musicOn ? <Pause size={19}/> : <Play size={19}/>}<span>{musicOn ? 'PAUSE MUSIC' : 'PLAY MUSIC'}</span></button>
  </div>
}
export default App
