import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '@appdeploy/client';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Instagram,
  MapPin,
  Music2,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  X,
  Bot,
  Award,
  Send,
  LoaderCircle,
  Languages,
  HeartHandshake,
} from 'lucide-react';

const packages = [
  {
    name: 'Fan Experience',
    price: '$299',
    featured: false,
    perks: [
      'Professional photo opportunity',
      'Exclusive event laminate',
      'Signed 8x10 keepsake',
      'Early venue entry',
    ],
  },
  {
    name: 'VIP Meet & Greet',
    price: '$2,000',
    featured: true,
    perks: [
      'Everything in Fan Experience',
      'Personal meet & greet',
      'Premium photo session with dedicated photo support',
      'Limited-edition VIP merch package',
      'Priority check-in and expedited entry',
      'Dedicated VIP host for the guest journey',
      'Signed VIP keepsake or collectible',
      'Preferred access to the designated meet & greet area',
      'Digital event photo follow-up when offered',
    ],
  },
  {
    name: 'Ultimate Access',
    price: '$999',
    featured: false,
    perks: [
      'Everything in VIP Meet & Greet',
      'Extended one-on-one experience',
      'Premium signed collectible',
      'Exclusive backstage-style gift box',
      'Front-of-line access',
    ],
  },
];

const faqs = [
  [
    'Is this an official event?',
    'This demo site is a fan-event concept and is not an official Chris Brown website or endorsement. Confirm event details with the authorized ticketing provider before purchasing.',
  ],
  [
    'What should I bring?',
    'Bring your ticket confirmation and a valid photo ID. Event-specific instructions are provided after registration.',
  ],
  [
    'Can I transfer my package?',
    'Package transfer policies vary by event. Check the final event terms supplied with your confirmation.',
  ],
  [
    'When do I receive details?',
    'Registered guests receive the event schedule and check-in instructions by email when those details are finalized.',
  ],
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'yo', label: 'Yorùbá' },
];

function App() {
  const [selected, setSelected] = useState('VIP Meet & Greet');
  const [language, setLanguage] = useState('en');
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPackageCheckout, setShowPackageCheckout] = useState(false);
  const [showManagementTicketModal, setShowManagementTicketModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [fanBadgePurchased, setFanBadgePurchased] = useState(false);
  const [showBadgeCheckout, setShowBadgeCheckout] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('$100');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hi! I can help with packages, RSVP questions, the guest experience, and the FAQ. What would you like to know?' },
  ]);

  const sendChat = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const message = chatInput.trim();
    if (!message || chatLoading) return;
    const nextMessages = [...chatMessages, { role: 'user' as const, content: message }];
    setChatMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await api.post('/api/ai-chat', { message, history: nextMessages.slice(-8) });
      setChatMessages(current => [...current, { role: 'assistant', content: response.data.reply }]);
    } catch {
      setChatMessages(current => [...current, { role: 'assistant', content: 'Sorry, the assistant is temporarily unavailable. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem('site-language');
    if (saved && languages.some(item => item.code === saved)) setLanguage(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('site-language', language);
    document.documentElement.lang = language;
    const widget = document.querySelector('[data-translator-widget]') as HTMLSelectElement | null;
    if (widget) widget.value = language;
  }, [language]);

  const changeLanguage = (code: string) => {
    setLanguage(code);
    if (code === 'en') return;
    const supported = ['es', 'fr', 'pt', 'de', 'it'];
    if (!supported.includes(code)) return;
    const google = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (google) {
      google.value = code;
      google.dispatchEvent(new Event('change'));
    }
  };

  const submitInterest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app">
      <header className="nav">
        <a
          className="brand"
          href="#top"
          aria-label="Chris Brown Meet and Greet home"
        >
          <span>CB</span> MEET & GREET
        </a>
        <nav>
          <a href="#top">Home</a>
          <a href="#music">Music</a>
          <a href="#videos">Videos</a>
          <a href="#packages">Meet & Greet</a>
          <a href="#fan-badge">Store</a>
        </nav>
        <button
          className="navCta"
          onClick={() =>
            document
              .getElementById('rsvp')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Reserve Interest <ArrowRight size={16} />
        </button>
      </header>

      <div id="google_translate_element" aria-hidden="true" />
      <main id="top">
        <section className="hero">
          <div className="heroGlow" />
          <div className="heroCopy">
            <div className="eyebrow">
              <Sparkles size={14} /> THE FAN EXPERIENCE
            </div>
            <h1>
              Closer to the
              <br />
              <em>moment.</em>
            </h1>
            <p>
              Step beyond the show and into a premium Chris Brown fan experience
              designed around the music, the memories, and an unforgettable meet
              & greet.
            </p>
            <div className="heroActions">
              <button className="primary" onClick={() => setShowManagementTicketModal(true)}>
                <Ticket size={18} /> Get Tickets from Management <ArrowRight size={18} />
              </button>
              <button
                className="ghost"
                onClick={() =>
                  document
                    .getElementById('packages')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Explore Packages <ArrowRight size={18} />
              </button>
              <button className="ghost" onClick={() => setShowModal(true)}>
                <PlayIcon /> See Experience
              </button>
            </div>
            <div className="microTrust">
              <ShieldCheck size={15} /> Fan-event concept · Verify official details before purchase
            </div>
          </div>
          <div className="heroVisual">
            <div className="portraitFrame">
              <div className="portrait">
                <div className="portraitLabel">
                  <Music2 size={14} /> BREEZY EXPERIENCE
                </div>
                <div className="silhouette" aria-hidden="true">
                  <div className="head" />
                  <div className="body" />
                </div>
                <div className="portraitText">
                  CHRIS
                  <br />
                  <strong>BROWN</strong>
                </div>
              </div>
            </div>
            <div className="floatingCard">
              <Star size={16} fill="currentColor" />
              <div>
                <b>VIP access</b>
                <span>Limited availability</span>
              </div>
            </div>
          </div>
        </section>

        <section className="artistLinks">
          <a href="#music"><Music2 size={15} /> MUSIC</a>
          <a href="#videos"><Sparkles size={15} /> VIDEOS</a>
          <a href="https://chrisbrownworld.com/" target="_blank" rel="noreferrer"><ArrowRight size={15} /> OFFICIAL SITE</a>
        </section>

        <section className="eventBar">
          <div>
            <CalendarDays size={22} />
            <div>
              <span>EVENT DATE</span>
              <b>To be announced</b>
            </div>
          </div>
          <div>
            <Clock3 size={22} />
            <div>
              <span>CHECK-IN</span>
              <b>Details after confirmation</b>
            </div>
          </div>
          <div>
            <MapPin size={22} />
            <div>
              <span>LOCATION</span>
              <b>Selected event city</b>
            </div>
          </div>
          <div className="eventNote">Dates and locations vary by event.</div>
        </section>

        <section className="section experience" id="experience">
          <div className="sectionIntro">
            <span className="kicker">01 / THE EXPERIENCE</span>
            <h2>
              One moment.
              <br />
              <em>For the memory.</em>
            </h2>
          </div>
          <div className="experienceGrid">
            <div className="experienceCard dark">
              <span>01</span>
              <h3>Meet</h3>
              <p>A personal hello in a dedicated guest experience area.</p>
            </div>
            <div className="experienceCard imageLike">
              <span>02</span>
              <h3>Capture</h3>
              <p>A professional photo opportunity to take the moment home.</p>
            </div>
            <div className="experienceCard cream">
              <span>03</span>
              <h3>Keep</h3>
              <p>Collect limited event memorabilia made for the occasion.</p>
            </div>
          </div>
        </section>

        <section className="artistSection" id="music">
          <div className="artistSectionHeader">
            <span className="kicker">MUSIC / BREEZY</span>
            <h2>Sound. <em>Style.</em> Energy.</h2>
            <p>A polished artist-style area for releases, listening links, and fan updates.</p>
          </div>
          <div className="musicCards">
            <article><span>01</span><h3>Latest Release</h3><p>Featured music can be highlighted here with a direct listening call-to-action.</p><a href="https://chrisbrownworld.com/" target="_blank" rel="noreferrer">LISTEN / EXPLORE <ArrowRight size={15} /></a></article>
            <article><span>02</span><h3>Discography</h3><p>Build a visual archive for albums, singles, collaborations, and special releases.</p><a href="https://chrisbrownworld.com/" target="_blank" rel="noreferrer">VIEW MUSIC <ArrowRight size={15} /></a></article>
            <article><span>03</span><h3>Team Breezy</h3><p>Keep fans connected with newsletter updates and official artist channels.</p><a href="#rsvp">JOIN UPDATES <ArrowRight size={15} /></a></article>
          </div>
        </section>

        <section className="artistSection darkArtist" id="videos">
          <div className="videoFeature">
            <div className="videoPlay"><Music2 size={24} /></div>
            <div><span className="kicker">WATCH NOW</span><h2>Music in <em>motion.</em></h2><p>Use this space for official music videos, performance clips, and visual premieres.</p><a href="https://www.youtube.com/@ChrisBrownTV" target="_blank" rel="noreferrer">WATCH OFFICIAL VIDEOS <ArrowRight size={15} /></a></div>
          </div>
        </section>

        <section className="section fanBadgeSection" id="fan-badge">
          <div className="fanBadgeVisual" aria-label="CB Fan digital badge">
            <div className="fanBadgeSeal"><Award size={25} /><span>CB</span><small>FAN</small></div>
            <div className="fanBadgeRibbon">FAN EXPERIENCE · 2026</div>
          </div>
          <div className="fanBadgeCopy">
            <span className="kicker">FAN BADGE</span>
            <h2>Carry the <em>moment.</em></h2>
            <p>Purchase a digital fan badge for this fan-experience concept and celebrate your place in the community.</p>
            <div className="fanBadgePrice"><span className="saleOldPrice">$700</span><span className="salePrice">$500</span><span className="saleLabel">ON SALE</span></div>
            <button className={`primary badgeButton ${fanBadgePurchased ? 'claimed' : ''}`} onClick={() => setShowBadgeCheckout(true)}>
              <Award size={17} /> Purchase Fan Badge
            </button>
            <small className="badgeNote">Digital concept badge only. It does not provide event access, ticketing privileges, or official artist affiliation. Price shown is illustrative.</small>
          </div>
        </section>

        <section className="section packages" id="packages">
          <div className="sectionIntro centered">
            <span className="kicker">02 / PACKAGES</span>
            <h2>
              Choose your <em>access.</em>
            </h2>
            <p>Three ways to make the night more memorable.</p>
          </div>
          <div className="packageGrid">
            {packages.map(pkg => (
              <button
                key={pkg.name}
                className={`packageCard ${pkg.featured ? 'featured' : ''} ${selected === pkg.name ? 'selected' : ''}`}
                onClick={() => { setSelected(pkg.name); setShowPackageCheckout(true); }}
              >
                {pkg.featured && <div className="popular">MOST REQUESTED</div>}
                <div className="packageTop">
                  <span>{pkg.name}</span>
                  <b>{pkg.price}</b>
                </div>
                <ul>
                  {pkg.perks.map(perk => (
                    <li key={perk}>
                      <Check size={15} /> {perk}
                    </li>
                  ))}
                </ul>
                <span className="choose">
                  Purchase {pkg.name} {' '}
                  <ArrowRight size={16} />
                </span>
                {pkg.featured && (
                  <div className="vipExtra">
                    <div className="vipExtraTitle"><Star size={14} /> VIP access includes</div>
                    <div className="vipExtraGrid">
                      <span>Dedicated VIP host</span>
                      <span>Expedited entry</span>
                      <span>Premium photo support</span>
                      <span>Exclusive keepsake</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
            <p className="finePrint">
            Package names, inclusions, pricing, dates, and availability are
            illustrative for this website concept and must be verified with the
            authorized event organizer. VIP inclusions may vary by event.
          </p>
        </section>

        <section className="section accommodation" id="accommodation">
          <div className="sectionIntro centered">
            <span className="kicker">03 / ACCOMMODATION</span>
            <h2>
              Stay close to the <em>moment.</em>
            </h2>
            <p>Accommodation options can be arranged around the confirmed event city and schedule.</p>
          </div>
          <div className="accommodationGrid">
            <div className="stayCard featuredStay">
              <span className="stayTag">PREMIUM</span>
              <MapPin size={20} />
              <h3>Premium Stay</h3>
              <p>Comfort-focused accommodation with convenient access to the event area.</p>
              <b>Details to be announced</b>
            </div>
            <div className="stayCard">
              <span className="stayTag">FLEXIBLE</span>
              <Clock3 size={20} />
              <h3>Nearby Hotels</h3>
              <p>A selection of nearby hotel options based on the final event location.</p>
              <b>Location dependent</b>
            </div>
            <div className="stayCard">
              <span className="stayTag">GROUPS</span>
              <Ticket size={20} />
              <h3>Group Stay</h3>
              <p>Ask about room arrangements for guests traveling together.</p>
              <b>Availability varies</b>
            </div>
          </div>
          <div className="accommodationNote">
            <ShieldCheck size={16} /> Accommodation information is illustrative for this concept site. Confirm hotel names, prices, dates, transportation, and availability with the authorized event organizer before booking.
          </div>
          <button className="primary accommodationCta" onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}>
            Request Accommodation Info <ArrowRight size={18} />
          </button>
        </section>

        <section className="section donationSection" id="donation">
          <div className="donationVisual" aria-hidden="true">
            <div className="donationCircle"><HeartHandshake size={44} /><span>CARE</span><small>FOR CHILDREN</small></div>
          </div>
          <div className="donationCopy">
            <span className="kicker">GIVE BACK / CHILDREN'S CARE</span>
            <h2>Share a little <em>hope.</em></h2>
            <p>Support a children's care and education fund within this fan-experience concept. Your contribution can be presented as support for food, school supplies, clothing, healthcare, and safe daily care.</p>
            <div className="donationAmounts">
              {['$100', '$250', '$500', '$1,000'].map(amount => <button key={amount} className={donationAmount === amount ? 'active' : ''} onClick={() => setDonationAmount(amount)}>{amount}</button>)}
            </div>
            <button className="primary donationButton" onClick={() => setShowDonationModal(true)}><HeartHandshake size={18} /> Donate {donationAmount}</button>
            <small className="donationNote">Illustrative donation experience only. No donation is processed on this concept site, and this page does not represent an official charity, orphanage, or Chris Brown endorsement.</small>
          </div>
        </section>

        <section className="rsvp" id="rsvp">
          <div className="rsvpCopy">
            <span className="kicker">03 / RESERVE INTEREST</span>
            <h2>
              Be first
              <br />
              to know.
            </h2>
            <p>
              Leave your details and preferred package. This form records
              interest only and does not charge you.
            </p>
            <div className="selectedPackage">
              <Ticket size={18} />
              <span>Selected package</span>
              <b>{selected}</b>
            </div>
          </div>
          <form className="rsvpForm" onSubmit={submitInterest}>
            {submitted ? (
              <div className="success">
                <Check size={30} />
                <h3>You're on the list.</h3>
                <p>
                  Thanks — your interest in the {selected} package has been
                  recorded for this demo experience.
                </p>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another
                </button>
              </div>
            ) : (
              <>
                <label>
                  Full name
                  <input required name="name" placeholder="Your name" />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Preferred city
                  <input required name="city" placeholder="City" />
                </label>
                <button className="primary wide" type="submit">
                  Reserve Interest <ArrowRight size={18} />
                </button>
                <small>
                  By submitting, you agree to receive event-related information.
                  No payment is taken.
                </small>
              </>
            )}
          </form>
        </section>

        <section className="section faq" id="faq">
          <div className="sectionIntro">
            <span className="kicker">04 / FAQ</span>
            <h2>
              Questions,
              <br />
              <em>answered.</em>
            </h2>
          </div>
          <div className="faqList">
            {faqs.map(([q, a], i) => (
              <div className={`faqItem ${openFaq === i ? 'open' : ''}`} key={q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{q}</span>
                  {openFaq === i ? <X size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="finalCta">
          <div>
            <span className="kicker">THE NIGHT STARTS HERE</span>
            <h2>
              Make the moment
              <br />
              <em>yours.</em>
            </h2>
          </div>
          <button
            className="primary"
            onClick={() =>
              document
                .getElementById('rsvp')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Reserve Interest <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer>
        <div className="footerTranslator">
          <Languages size={17} />
          <span>Language</span>
          <select data-translator-widget aria-label="Choose language" value={language} onChange={event => changeLanguage(event.target.value)}>
            {languages.map(item => <option key={item.code} value={item.code}>{item.label}</option>)}
          </select>
        </div>
        <div className="brand">
          <span>CB</span> MEET & GREET
        </div>
        <div className="footerLinks">
          <a href="#experience">Experience</a>
          <a href="#packages">Packages</a>
          <a href="#accommodation">Accommodation</a>
          <a href="#fan-badge">Fan Badge</a>
          <a href="#faq">FAQ</a>
          <a href="#rsvp">Reserve</a>
          <a href="mailto:chrismaubrown0i@gmail.com">Contact</a>
        </div>
        <div className="social">
          <Instagram size={18} /> @chrisbrown
        </div>
        <p>
          © 2026 Fan Experience Concept · Not affiliated with or endorsed by
          Chris Brown. · Contact: <a href="mailto:chrismaubrown0i@gmail.com">chrismaubrown0i@gmail.com</a>
        </p>
      </footer>

      <button className="chatLauncher" aria-label="Open AI guest assistant" onClick={() => setChatOpen(true)}><Bot size={20} /><span>Ask AI</span></button>

      {chatOpen && <div className="chatPanel" aria-label="AI guest assistant">
        <div className="chatHeader"><div><b>Guest Assistant</b><span>AI help for this experience</span></div><button onClick={() => setChatOpen(false)} aria-label="Close assistant"><X size={18} /></button></div>
        <div className="chatMessages">{chatMessages.map((message, index) => <div key={index} className={`chatBubble ${message.role}`}>{message.content}</div>)}{chatLoading && <div className="chatBubble assistant"><LoaderCircle className="spin" size={16} /> Thinking…</div>}</div>
        <form className="chatForm" onSubmit={sendChat}><input value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder="Ask about packages or RSVP…" aria-label="Ask the AI assistant" /><button type="submit" disabled={chatLoading || !chatInput.trim()} aria-label="Send message"><Send size={17} /></button></form>
        <div className="chatDisclaimer">AI assistant · Verify official event details with the authorized organizer.</div>
      </div>}


      {showManagementTicketModal && (
        <div className="modalBackdrop" onClick={() => setShowManagementTicketModal(false)}>
          <div className="modal checkoutModal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setShowManagementTicketModal(false)} aria-label="Close management ticket request"><X /></button>
            <span className="kicker">TICKET MANAGEMENT</span>
            <h3>Get tickets from management</h3>
            <p className="modalLead">Send your ticket request to the event management team. Management will confirm the available date, ticket type, price, and payment instructions directly.</p>
            <label>Full name<input placeholder="Your name" /></label>
            <label>Email address<input type="email" placeholder="you@example.com" /></label>
            <label>Preferred show<input placeholder="City or tour date" /></label>
            <label>Ticket request<input placeholder="Number of tickets / ticket type" /></label>
            <a className="primary wide" href="mailto:chrismaubrown0i@gmail.com?subject=Ticket%20Request%20from%20Fan%20Experience" onClick={() => setShowManagementTicketModal(false)}>
              <Send size={17} /> Contact Management <ArrowRight size={17} />
            </a>
            <small className="badgeNote">Management contact is for this fan-event concept. Confirm authorization and official ticket details before sending payment or personal information.</small>
          </div>
        </div>
      )}

      {showPackageCheckout && (
        <div className="modalBackdrop" onClick={() => setShowPackageCheckout(false)}>
          <div className="modal checkoutModal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setShowPackageCheckout(false)} aria-label="Close package checkout"><X /></button>
            <span className="kicker">PACKAGE CHECKOUT</span>
            <h3>Purchase {selected}</h3>
            <div className="checkoutSummary"><span>{selected}</span><b>{packages.find(pkg => pkg.name === selected)?.price}</b></div>
            <label>Full name<input required placeholder="Your name" /></label>
            <label>Email address<input required type="email" placeholder="you@example.com" /></label>
            <div className="paymentPlaceholder"><ShieldCheck size={17} /><span>Secure payment screen</span><small>Payment processing is not connected yet. You can add your payment provider later.</small></div>
            <button className="primary wide" onClick={() => setShowPackageCheckout(false)}><Ticket size={17} /> Continue to Payment</button>
            <small className="badgeNote">Concept checkout only — no real payment is processed.</small>
          </div>
        </div>
      )}

      {showBadgeCheckout && (
        <div className="modalBackdrop" onClick={() => setShowBadgeCheckout(false)}>
          <div className="modal checkoutModal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setShowBadgeCheckout(false)} aria-label="Close checkout"><X /></button>
            <span className="kicker">FAN BADGE CHECKOUT</span>
            <h3>Purchase your Fan Badge</h3>
            <div className="checkoutSummary"><span>Digital Fan Badge <small className="checkoutSale">ON SALE</small></span><b><s>$700</s> $500</b></div>
            <label>Full name<input required placeholder="Your name" /></label>
            <label>Email address<input required type="email" placeholder="you@example.com" /></label>
            <div className="paymentPlaceholder"><ShieldCheck size={17} /><span>Secure payment screen</span><small>Payment processing is not connected yet.</small></div>
            <button className="primary wide" onClick={() => { setFanBadgePurchased(true); setShowBadgeCheckout(false); }}><Award size={17} /> Continue to Payment</button>
            <small className="badgeNote">This is a concept checkout. No real payment is processed.</small>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modalBackdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setShowModal(false)}>
              <X />
            </button>
            <div className="playCircle">
              <Music2 />
            </div>
            <h3>The experience</h3>
            <p>
              A premium meet-and-greet concept focused on a smooth guest
              journey, personal connection, and a keepsake-worthy photo moment.
            </p>
            <button className="primary" onClick={() => setShowModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayIcon() {
  return <span className="playIcon">▶</span>;
}

export default App;
