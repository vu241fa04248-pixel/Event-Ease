import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Search, Menu, X, ArrowRight, Sparkles, LogOut, PlusCircle } from 'lucide-react';
import api from './services/api';

const fallbackEvents = [
  {id:1,title:'Neon Nights Music Festival',category:'Music',date:'2026-12-12',time:'6:00 PM',location:'Hyderabad',price:250000, image:'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=85',description:'An unforgettable evening of live music, lights and incredible performances.'},
  {id:2,title:'The Grand Wedding Expo',category:'Wedding',date:'2026-12-19',time:'10:00 AM',location:'HITEX, Hyderabad',price:300000, image:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',description:'Meet leading wedding designers, planners and celebration specialists.'},
  {id:3,title:'Future Forward Tech Summit',category:'Conference',date:'2027-01-08',time:'9:30 AM',location:'Hitech City, Hyderabad',price:200000, image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85',description:'Ideas, innovation and conversations shaping the technology of tomorrow.'},
  {id:4,title:'Color Splash College Fest',category:'College',date:'2027-01-15',time:'4:00 PM',location:'Gachibowli, Hyderabad',price:100000, image:'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85',description:'A high-energy celebration of music, dance, art and campus culture.'},
  {id:5,title:'Birthday Celebration Workshop',category:'Workshop',date:'2027-01-22',time:'11:00 AM',location:'Jubilee Hills, Hyderabad',price:25000, image:'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=85',description:'Learn creative party styling and celebration planning from experts.'},
  {id:6,title:'Champions Sports Meet',category:'Sports',date:'2027-02-02',time:'8:00 AM',location:'Gachibowli Stadium',price:75000, image:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85',description:'A day of competition, teamwork and sporting excitement.'},
  {id:7,title:'Sunset Beats Open Air',category:'Music',date:'2027-02-14',time:'5:30 PM',location:'Moula Ali Hill, Hyderabad',price:180000, image:'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85',description:'Dance into the evening with live DJs, food stalls and sunset views.'},
  {id:8,title:'Creative Wedding Showcase',category:'Wedding',date:'2027-02-20',time:'10:00 AM',location:'Taj Krishna, Hyderabad',price:250000, image:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',description:'Explore fresh ideas, local vendors and inspiration for your celebration.'},
  {id:9,title:'Future Makers Innovation Forum',category:'Conference',date:'2027-03-06',time:'9:00 AM',location:'T-Hub, Hyderabad',price:150000, image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85',description:'Meet builders and thinkers sharing practical ideas for the future.'},
  {id:10,title:'Hyderabad Campus Carnival',category:'College',date:'2027-03-20',time:'3:00 PM',location:'Osmania University, Hyderabad',price:90000, image:'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85',description:'An energetic afternoon of campus performances, games and food.'},
  {id:11,title:'City Park Run and Fitness Day',category:'Sports',date:'2027-04-04',time:'6:30 AM',location:'KBR National Park, Hyderabad',price:30000, image:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85',description:'Join runners of all levels for a friendly community fitness event.'},
  {id:12,title:'Hands-on Art and Craft Studio',category:'Workshop',date:'2027-04-18',time:'2:00 PM',location:'Banjara Hills, Hyderabad',price:20000, image:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85',description:'Spend an afternoon learning creative techniques and making your own artwork.'}
];
const categories = ['All','Music','Wedding','Conference','College','Workshop','Sports'];
const galleryPhotos = {
 Music:['photo-1501386761578-eac5c94b800a','photo-1506157786151-b8491531f063','photo-1459749411175-04bf5292ceea','photo-1470229722913-7c0e2dbbafd3'],
 Wedding:['photo-1519741497674-611481863552','photo-1511795409834-ef04bbd61622','photo-1519225421980-715cb0215aed','photo-1464366400600-7168b8af9bc3'],
 Conference:['photo-1540575467063-178a50c2df87','photo-1497366754035-f200968a6e72','photo-1517245386807-bb43f82c33c4','photo-1497366754035-f200968a6e72'],
 College:['photo-1506157786151-b8491531f063','photo-1523580494863-6f3031224c94','photo-1514525253161-7a46d19cd819','photo-1492684223066-81342ee5ff30'],
 Workshop:['photo-1513151233558-d860c5398176','photo-1513364776144-60967b0f800f','photo-1460661419201-fd4cecdf8a8b','photo-1492684223066-81342ee5ff30'],
 Sports:['photo-1461896836934-ffe607ba8211','photo-1531415074968-036ba1b575da','photo-1461896836934-ffe607ba8211','photo-1517649763962-0c623066013b']
};
const showcaseBudgets = new Map(fallbackEvents.map((event) => [event.title, event.price]));
function galleryFor(event) {
 const categoryImages=(galleryPhotos[event.category]||galleryPhotos.Music).map((photo)=>`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=85`);
 return [...new Set([event.image,...(Array.isArray(event.images)?event.images:[]),...categoryImages].filter(Boolean))].slice(0,5);
}
function money(n){ return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n || 0); }
function Header({user,onLogout}) {
 const [open,setOpen]=useState(false);
 return <header className="header"><Link className="brand" to="/"><span className="brand-mark"><Sparkles size={19}/></span>eventra<span className="brand-dot">.</span></Link>
 <button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
 <nav className={open?'nav open':'nav'}><NavLink to="/" onClick={()=>setOpen(false)}>Explore</NavLink><a href="/#categories" onClick={()=>setOpen(false)}>Categories</a><a href="/#about" onClick={()=>setOpen(false)}>About</a>{user?<><Link to="/dashboard">Dashboard</Link><button className="text-button" onClick={onLogout}><LogOut size={15}/> Sign out</button></>:<Link className="nav-cta" to="/login">Sign in</Link>}</nav></header>
}
function EventCard({event}) {
 return <article className="event-card"><Link to={`/events/${event.id}`} className="event-image"><img src={event.image} alt={event.title} loading="lazy"/><span className="category-tag">{event.category}</span></Link><div className="event-info"><div className="event-date"><CalendarDays size={15}/>{new Date(event.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div><Link to={`/events/${event.id}`}><h3>{event.title}</h3></Link><p className="event-location"><MapPin size={15}/>{event.location}</p><div className="event-bottom"><strong>{money(event.price)} <small>event budget</small></strong><Link to={`/events/${event.id}`} className="arrow-link" aria-label={`View ${event.title}`}><ArrowRight size={18}/></Link></div></div></article>
}
function Home({events}) {
 const [category,setCategory]=useState('All'); const [search,setSearch]=useState('');
 const shown=useMemo(()=>events.filter(e=>(category==='All'||e.category===category)&&`${e.title} ${e.location} ${e.category}`.toLowerCase().includes(search.toLowerCase())),[events,category,search]);
 return <><section className="hero"><div className="hero-overlay"></div><div className="hero-content"><span className="eyebrow"><Sparkles size={14}/> MAKE EVERY MOMENT COUNT</span><h1>Find your next<br/><em>unforgettable</em> experience.</h1><p>Browse our event gallery, find the right experience, and book it at its listed budget.</p><div className="hero-search"><Search size={20}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search our event gallery..."/><a href="#events" className="search-btn">Explore events</a></div><div className="hero-stats"><span><b>500+</b> experiences</span><span><b>50K+</b> happy attendees</span><span><b>20+</b> cities</span></div></div></section>
 <section className="section" id="categories"><div className="section-heading"><div><span className="eyebrow dark">EXPLORE BY INTEREST</span><h2>Find your kind of event</h2></div><p>From big nights out to ideas worth sharing.</p></div><div className="category-row">{categories.slice(1).map((c,i)=><button key={c} onClick={()=>{setCategory(c);document.getElementById('events')?.scrollIntoView({behavior:'smooth'});}} className="category-chip"><span>{['🎵','💍','🎤','🎓','🧠','🏆'][i]}</span>{c}</button>)}</div></section>
 <section className="section events-section" id="events"><div className="section-heading"><div><span className="eyebrow dark">CURATED FOR YOU</span><h2>Our event gallery</h2></div><div className="filter-row">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'filter active':'filter'}>{c}</button>)}</div></div>{shown.length?<div className="event-grid">{shown.map(e=><EventCard key={e.id} event={e}/>)}</div>:<div className="empty">No events match your search. Try another keyword.</div>}</section>
 <section className="host-banner" id="about"><div><span className="eyebrow">BRING PEOPLE TOGETHER</span><h2>Have an event in mind?</h2><p>Create an experience people will remember. Manage event bookings and attendee details in one place.</p><Link to="/login" className="light-btn">Start organizing <ArrowRight size={17}/></Link></div><img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85" alt="Guests enjoying an elegant event"/></section>
 <footer><Link className="brand" to="/">eventra<span className="brand-dot">.</span></Link><span>Make moments matter. © 2026 Eventra</span><a href="mailto:hello@example.com">Contact support</a></footer></>;
}
function EventDetails({events}) {
 const {id}=useParams(); const event=events.find(e=>String(e.id)===id); const [message,setMessage]=useState(''); const [booked,setBooked]=useState(false); const [selectedImage,setSelectedImage]=useState('');
 const images=event?galleryFor(event):[];
 useEffect(()=>{setSelectedImage(event?.image||'');setMessage('');setBooked(false);},[id,event?.image]);
 async function book(){
  const token=localStorage.getItem('eventra_token');
  if(!token){setMessage('Please sign in before booking.');return;}
  if(token==='demo-token'||token==='local-token'){
   const bookings=JSON.parse(localStorage.getItem('eventra_bookings')||'[]');
   const booking={id:`DEMO-${Date.now()}`,eventId:event.id,eventTitle:event.title,total:event.price,status:'confirmed',createdAt:new Date().toISOString()};
   bookings.push(booking);
   localStorage.setItem('eventra_bookings',JSON.stringify(bookings));
   setBooked(true);
   setMessage(`You're booked! Booking ID: ${booking.id}. Demo booking saved in this browser.`);
   return;
  }
  try{
   const res=await api.post('/bookings',{eventId:event.id});
   setBooked(true);
   setMessage(`You're booked! Booking ID: ${res.data.booking.id}`);
  }catch(err){
   if(err.response?.status===401){
    localStorage.removeItem('eventra_token');
    localStorage.removeItem('eventra_user');
    setMessage('Your session expired. Please sign in again before booking.');
    return;
   }
   setMessage(err.response?.data?.message||'Booking could not be completed. Please try again.');
  }
 }
 if(!event)return <main className="page-wrap"><h2>Event not found</h2><Link to="/">Back to events</Link></main>;
 return <main className="page-wrap"><Link to="/" className="back-link">← Back to event gallery</Link><section className="event-gallery" aria-label={`${event.title} photo gallery`}><img className="detail-cover" src={selectedImage||event.image} alt={`${event.title} gallery view`}/><div className="gallery-thumbnails">{images.map((image,index)=><button type="button" className={image===(selectedImage||event.image)?'gallery-thumbnail selected':'gallery-thumbnail'} key={image} onClick={()=>setSelectedImage(image)} aria-label={`View ${event.title} photo ${index+1}`} aria-pressed={image===(selectedImage||event.image)}><img src={image} alt="" loading="lazy"/></button>)}</div></section><div className="detail-layout"><div><span className="eyebrow dark">{event.category} EVENT</span><h1>{event.title}</h1><p className="detail-description">{event.description}</p><div className="detail-facts"><span><CalendarDays/>{new Date(event.date).toLocaleDateString('en-IN',{dateStyle:'full'})} · {event.time}</span><span><MapPin/>{event.location}</span></div><h3>About this experience</h3><p>Book this event at its listed budget. Your booking is for the event itself, with no ticket quantities.</p></div><aside className="booking-box"><span className="eyebrow dark">EVENT BOOKING</span><h2>{money(event.price)}</h2><p className="muted">Indicative total event budget</p><div className="total-line"><span>Event budget</span><strong>{money(event.price)}</strong></div><button className="primary-btn full" onClick={book} disabled={booked}>{booked?'Booked successfully':'Book this event'}</button>{message&&<p className="notice">{message}</p>}<small className="muted">One event booking · Budget shown above</small></aside></div></main>;
}
const DEMO_EMAIL = 'demo@gmail.com';
const DEMO_PASSWORD = 'demo1234';
const REGISTERED_USERS_KEY = 'eventra_registered_users';
function Login({onLogin}) {
 const navigate = useNavigate();
 const [mode,setMode]=useState('login');
 const [form,setForm]=useState({name:'',email:DEMO_EMAIL,password:DEMO_PASSWORD});
 const [error,setError]=useState('');
 async function submit(e){
  e.preventDefault();
  setError('');
  const payload = { ...form, name: form.name.trim(), email: form.email.trim(), password: form.password.trim() };

  try {
   const {data}=await api.post(`/auth/${mode}`,payload);
   localStorage.setItem('eventra_token',data.token);
   onLogin(data.user);
   navigate('/');
   return;
  } catch (err) {
   const storedUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
   const demoMatch = payload.email.toLowerCase() === DEMO_EMAIL.toLowerCase() && payload.password === DEMO_PASSWORD;
   const localMatch = storedUsers.find((user) => user.email.toLowerCase() === payload.email.toLowerCase() && user.password === payload.password);

   if (mode === 'login' && (demoMatch || localMatch)) {
    const signedUser = demoMatch ? { id: 1, name: 'Demo User', email: payload.email, role: 'organizer' } : { id: localMatch.id, name: localMatch.name, email: localMatch.email, role: localMatch.role || 'attendee' };
    localStorage.setItem('eventra_token', demoMatch ? 'demo-token' : 'local-token');
    onLogin(signedUser);
    navigate('/');
    return;
   }

   if (mode === 'register') {
    const alreadyExists = storedUsers.some((user) => user.email.toLowerCase() === payload.email.toLowerCase());
    if (alreadyExists) {
     setError('This email is already registered. Please sign in instead.');
     return;
    }

    const newUser = {
      id: Date.now(),
      name: payload.name || 'New User',
      email: payload.email,
      password: payload.password,
      role: 'attendee'
    };

    storedUsers.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(storedUsers));
    localStorage.setItem('eventra_token', 'local-token');
    onLogin({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
    navigate('/');
    return;
   }

   setError(err.response?.data?.message || 'Unable to continue. Check that the backend is running.');
  }
 }
 return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}><span className="eyebrow dark">WELCOME TO EVENTRA</span><h1>{mode==='login'?'Welcome back':'Create your account'}</h1><p>Use the demo account below or create a new account.</p>{mode==='register'&&<input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}<input required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input required minLength="6" type="password" placeholder="Password (minimum 6 characters)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>{mode==='login'&&<p className="muted">Demo login: {DEMO_EMAIL} / {DEMO_PASSWORD}</p>}{error&&<p className="error">{error}</p>}<button className="primary-btn full">{mode==='login'?'Sign in':'Create account'}</button><p className="switch-auth">{mode==='login'?"New to Eventra?":"Already registered?"} <button type="button" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Create account':'Sign in'}</button></p></form></main>;
}
function Dashboard({user,events,onCreated}) {
 const [form,setForm]=useState({title:'',category:'Music',date:'',time:'',location:'',price:'',image:'',description:''});const [message,setMessage]=useState('');
 async function create(e){e.preventDefault();try{await api.post('/events',form);setMessage('Event created. It is now available in the event list.');setForm({title:'',category:'Music',date:'',time:'',location:'',price:'',image:'',description:''});onCreated();}catch(err){setMessage(err.response?.data?.message||'Could not create event. Organizer or admin access may be required.');}}
 return <main className="page-wrap dashboard"><span className="eyebrow dark">YOUR EVENT SPACE</span><h1>Hello, {user?.name||'there'} 👋</h1><p>Manage your event bookings and discover your next experience.</p><div className="dash-stats"><div><span>Available events</span><b>{events.length}</b></div><div><span>Your account</span><b>{user?.role||'attendee'}</b></div><div><span>Platform</span><b>Eventra</b></div></div><div className="dashboard-columns"><section><h2>Explore events</h2><div className="mini-events">{events.slice(0,4).map(e=><Link to={`/events/${e.id}`} key={e.id}><img src={e.image} alt=""/><span>{e.title}<small>{e.location}</small></span><ArrowRight size={16}/></Link>)}</div></section><section className="create-panel"><h2><PlusCircle size={20}/> Create an event</h2><p className="muted">Event creation is available to organizer and admin accounts.</p><form onSubmit={create} className="create-form"><input required placeholder="Event title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select><input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><input required placeholder="Time (e.g. 6:00 PM)" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/><input required placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><input required type="number" min="0" placeholder="Event budget (INR)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><input className="wide" placeholder="Image URL (optional)" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/><textarea className="wide" required placeholder="Event description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="primary-btn wide">Publish event</button></form>{message&&<p className="notice">{message}</p>}</section></div></main>;
}
export default function App(){
 const [events,setEvents]=useState(fallbackEvents);const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('eventra_user')||'null')}catch{return null}});
 async function loadEvents(){try{const {data}=await api.get('/events');if(data.events?.length)setEvents(data.events.map((event)=>({...event,price:showcaseBudgets.get(event.title)??event.price})));}catch{}}
 useEffect(()=>{loadEvents();},[]);
 function login(u){setUser(u);localStorage.setItem('eventra_user',JSON.stringify(u));}
 function logout(){localStorage.removeItem('eventra_token');localStorage.removeItem('eventra_user');setUser(null);}
 return <><Header user={user} onLogout={logout}/><Routes><Route path="/" element={<Home events={events}/>}/><Route path="/events/:id" element={<EventDetails events={events}/>}/><Route path="/login" element={<Login onLogin={login}/>}/><Route path="/dashboard" element={user?<Dashboard user={user} events={events} onCreated={loadEvents}/>:<Login onLogin={login}/>}/><Route path="*" element={<Home events={events}/>}/></Routes></>;
}
