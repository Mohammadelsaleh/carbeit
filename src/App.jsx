import React, { useState, useEffect } from 'react';

// INITIAL STRUCTURAL STOCK DATA

const INITIAL_CARS = [
  { id: 1, make: 'Toyota', model: 'Camry', type: 'Sedan', year: 2022, price: 24000, fuelType: 'Hybrid', transmission: 'Automatic', owner: 'system', description: 'Exceptional condition mid-size sedan with pristine fuel efficiency tracking metrics. Single owner, garage kept, fully documented dealership maintenance schedule.', images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'] },
  { id: 2, make: 'Tesla', model: 'Model 3', type: 'Sedan', year: 2021, price: 35000, fuelType: 'Electric', transmission: 'Automatic', owner: 'system', description: 'Long Range all-wheel drive distribution. Autopilot system enabled, premium white interior architecture package, zero degradation on capacity cells.', images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'] },
  { id: 3, make: 'Ford', model: 'Mustang', type: 'Coupe', year: 2019, price: 28500, fuelType: 'Petrol', transmission: 'Manual', owner: 'system', description: 'EcoBoost Premium setup featuring performance exhaust upgrades, active driving mode selectors, and fully updated digital telemetry metrics.', images: ['https://images.unsplash.com/photo-1612462551853-fc79880cbbae?w=800&q=80', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'] },
];

// cars clasification types filter 
const CAR_TYPES = [
  'All', 'SUV', 'Sedan', 'Coupe', 'Hatchback', 
  'Convertible', 'Wagon', 'Pickup Truck', 'Minivan', 
  'Van', 'City Car', 'Truck'
];

//admin user and password
const ADMIN_USERNAME = 'mhmd';
const ADMIN_PASSWORD = '122333';

export default function App() {

  // CORE DATA PRIVILEGES STATE 
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('carbeit_inventory');
    return saved ? JSON.parse(saved) : INITIAL_CARS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('carbeit_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [savedListings, setSavedListings] = useState(() => {
    const saved = localStorage.getItem('carbeit_saved_progress');
    return saved ? JSON.parse(saved) : [];
  });

  // CORE INTERFACE NAVIGATION CONTROLS 
  const [activeView, setActiveView] = useState('catalog'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDetailCar, setSelectedDetailCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0); 
  const [editingCar, setEditingCar] = useState(null);

  //  MODAL TRIGGER TOGGLES 
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // INTERFACE SEARCH & FILTER S
  const [selectedType, setSelectedType] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  //  COMPONENT ACTION FORM STATES 
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('Buyer');

  const [newCar, setNewCar] = useState({
    make: '', model: '', type: 'SUV', year: '2026', price: '', fuelType: 'Petrol', transmission: 'Automatic', description: '', images: []
  });

  //  APPLICATION LIFECYCLE SYNCS 
  useEffect(() => { localStorage.setItem('carbeit_inventory', JSON.stringify(cars)); }, [cars]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('carbeit_user', JSON.stringify(currentUser));
    else localStorage.removeItem('carbeit_user');
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('carbeit_saved_progress', JSON.stringify(savedListings)); }, [savedListings]);

  useEffect(() => { if (searchInput.trim() === '') setActiveSearchTerm(''); }, [searchInput]);

  //  AUTHENTICATION EVENTS 
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) return;
    if (roleInput === 'Admin' && (usernameInput !== ADMIN_USERNAME || passwordInput !== ADMIN_PASSWORD)) {
      alert('Invalid Admin Credentials!');
      return;
    }
    setCurrentUser({ username: usernameInput, role: roleInput });
    setUsernameInput(''); setPasswordInput(''); setIsLoginModalOpen(false); setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null); setSavedListings([]); setActiveView('catalog'); setIsMenuOpen(false);
  };

  //  INVENTORY MANAGEMENT OPERATIONS 
  const handleMultiImageChange = (e, targetState, setTargetState) => {
    const files = Array.from(e.target.files);
    if (targetState.images.length + files.length > 12) {
      alert('Maximum capacity you reached the  Limit (12 images)');
      return;
    }
    const newUrls = files.map(file => URL.createObjectURL(file));
    setTargetState({ ...targetState, images: [...targetState.images, ...newUrls] });
  };

  const handleRemoveImageFromEdit = (indexToRemove) => {
    if (!editingCar) return;
    const updatedImages = editingCar.images.filter((_, idx) => idx !== indexToRemove);
    setEditingCar({ ...editingCar, images: updatedImages });
  };

  const handleCreateCarSubmit = (e) => {
    e.preventDefault();
    if (!newCar.make || !newCar.model || !newCar.price) return;
    const itemPayload = {
      ...newCar,
      id: Date.now(),
      price: parseFloat(newCar.price),
      year: parseInt(newCar.year),
      owner: currentUser ? currentUser.username : 'guest',
      description: newCar.description.trim() || 'No supplementary details listed for this specific stock profile.',
      images: newCar.images.length > 0 ? newCar.images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80']
    };
    setCars([itemPayload, ...cars]);
    alert('Listing successfully verified & loaded!');
    setNewCar({ make: '', model: '', type: 'SUV', year: '2026', price: '', fuelType: 'Petrol', transmission: 'Automatic', description: '', images: [] });
    setActiveView('catalog');
  };

  const openEditInterface = (car, e) => {
    e.stopPropagation();
    setEditingCar({ ...car });
    setSelectedDetailCar(null);
  };

  const handleUpdateCarSubmit = (e) => {
    e.preventDefault();
    if (editingCar.images.length === 0) {
      editingCar.images = ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80'];
    }
    setCars(cars.map(c => c.id === editingCar.id ? editingCar : c));
    alert('Listing item details updated successfully.');
    setEditingCar(null);
  };

  const handleDeleteCar = (carId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this listing from distribution?')) {
      setCars(cars.filter(car => car.id !== carId));
      setSavedListings(savedListings.filter(id => id !== carId));
      if (selectedDetailCar?.id === carId) setSelectedDetailCar(null);
    }
  };

  const toggleSaveListing = (carId, e) => {
    e.stopPropagation();
    if (!currentUser) { setIsLoginModalOpen(true); return; }
    setSavedListings(savedListings.includes(carId) ? savedListings.filter(id => id !== carId) : [...savedListings, carId]);
  };

  // --- CAROUSEL NAVIGATION ---
  const handlePrevImage = () => {
    if (!selectedDetailCar) return;
    const total = selectedDetailCar.images.length;
    setActiveImageIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!selectedDetailCar) return;
    const total = selectedDetailCar.images.length;
    setActiveImageIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const openDetailModal = (car) => {
    setSelectedDetailCar(car);
    setActiveImageIndex(0); 
  };

  const filteredCars = cars.filter(car => {
    const matchesType = selectedType === 'All' || car.type === selectedType;
    const matchesSearch = car.make.toLowerCase().includes(activeSearchTerm) || car.model.toLowerCase().includes(activeSearchTerm);
    return matchesType && matchesSearch;
  });

  const isAnyOverlayActive = isLoginModalOpen || isAboutModalOpen || isContactModalOpen || selectedDetailCar || editingCar;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased relative">
      
      {/* GLOBAL HEADER NAVBAR */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span onClick={() => { setActiveView('catalog'); setSearchInput(''); setActiveSearchTerm(''); }} className="text-xl md:text-2xl font-black text-orange-600 tracking-wider cursor-pointer select-none">CARBEIT</span>
        </div>

        <div className="flex items-center space-x-3">
          {currentUser && (
            <button onClick={() => setActiveView('profile')} className="bg-slate-100 hover:bg-slate-200 border text-slate-800 text-xs px-3 py-2 rounded-lg font-bold transition flex items-center gap-1">
              👤 View Profile
            </button>
          )}
          {currentUser ? (
            <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold transition">Sign Out</button>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm">Sign In</button>
          )}
        </div>
      </header>

      {/* FLYOUT SIDE NAVIGATION BAR DRAWER */}
      {isMenuOpen && (
        <>
          <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-slate-900/40 z-40 transition-opacity backdrop-blur-xs" />
          <aside className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl border-r border-gray-200 z-50 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <span className="text-xl font-black text-orange-600 tracking-wider">NAV MENU</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-2">
                <button onClick={() => { setActiveView('catalog'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeView === 'catalog' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}> Catalog</button>
                {currentUser && (
                  <button onClick={() => { setActiveView('profile'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeView === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>👤 My Account Profile</button>
                )}
                {(currentUser?.role === 'Seller' || currentUser?.role === 'Admin') && (
                  <button onClick={() => { setActiveView('seller'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeView === 'seller' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>🛠️ Seller Studio</button>
                )}
                {currentUser?.role === 'Admin' && (
                  <button onClick={() => { setActiveView('admin'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-red-600 transition flex items-center gap-2 ${activeView === 'admin' ? 'bg-red-50' : 'hover:bg-red-50/50'}`}>🛡️ System Management</button>
                )}
                <div className="border-t my-4 pt-4 space-y-1">
                  <button onClick={() => { setIsAboutModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">ℹ️ About Our Platform</button>
                  <button onClick={() => { setIsContactModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">📞 Contact Helpdesk</button>
                </div>
              </nav>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
              {currentUser ? (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Signed Profile</p>
                  <p className="text-sm font-black text-slate-800 truncate">{currentUser.username}</p>
                  <span className="inline-block mt-1 bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">{currentUser.role}</span>
                </div>
              ) : (
                <button onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition">Authenticate Client</button>
              )}
            </div>
          </aside>
        </>
      )}

      {/* CORE FRAME LAYOUT SPACE */}
      <main className={`max-w-7xl mx-auto px-4 md:px-8 py-8 transition duration-200 ${isAnyOverlayActive ? 'blur-sm select-none pointer-events-none' : ''}`}>
        
        {activeView === 'catalog' && (
          <>
            <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white mb-8 shadow-xl" >
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Find Vehicles</h1>
              <p className="text-slate-300 text-sm max-w-lg mb-6">Explore vehicles that meet your needs and preferences.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); setActiveSearchTerm(searchInput.trim().toLowerCase()); }} className="flex flex-wrap gap-2 max-w-xl bg-white p-2 rounded-xl text-gray-700">
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search make or model..." className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent" />
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition">Search</button>
              </form>
            </div>

            {/* CATALOG MAIN FILTER CHIPS GRAPHIC LAYOUT */}
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter By Structural Classification</p>
              <div className="flex flex-wrap gap-1.5 items-center justify-between">
                <div className="flex flex-wrap gap-1.5 max-w-5xl">
                  {CAR_TYPES.map(type => (
                    <button key={type} onClick={() => setSelectedType(type)} className={`px-3 py-1 rounded-full text-xs font-bold transition border ${selectedType === type ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>{type}</button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap mt-2 md:mt-0">Matches Found: {filteredCars.length}</p>
              </div>
            </div>

            {filteredCars.length === 0 ? (
              <div className="bg-white border rounded-xl p-12 text-center text-gray-400">No stock entries meet current criteria filters.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCars.map(car => {
                  const isSaved = savedListings.includes(car.id);
                  const isOwner = currentUser && (car.owner === currentUser.username || currentUser.role === 'Admin');
                  return (
                    <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <div className="h-48 bg-slate-100 overflow-hidden relative">
                          <img src={car.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80'} alt="" className="w-full h-full object-cover group-hover:scale-102 transition" />
                          <button onClick={(e) => toggleSaveListing(car.id, e)} className={`absolute top-3 right-3 p-2 rounded-full shadow-md z-10 ${isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                          </button>
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{car.year} • <span className="text-orange-600">{car.type}</span> • {car.transmission}</p>
                          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{car.make} {car.model}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{car.description}</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-gray-50 mt-2 flex items-center justify-between bg-slate-50/50">
                        <span className="text-lg font-black text-slate-900">${car.price.toLocaleString()}</span>
                        <div className="flex gap-1.5 mt-2">
                          {isOwner && (
                            <>
                              <button onClick={(e) => openEditInterface(car, e)} className="p-1.5 border border-amber-300 text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-bold transition">✏️</button>
                              <button onClick={(e) => handleDeleteCar(car.id, e)} className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition">🗑️</button>
                            </>
                          )}
                          <button onClick={() => openDetailModal(car)} className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">View Details</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* VIEW 2: SELLER CREATION DASHBOARD */}
        {activeView === 'seller' && (
          <div className="max-w-xl mx-auto bg-white border rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-black mb-1">Upload New Stock Listing</h2>
            <p className="text-xs text-gray-500 mb-6 border-b pb-3">Staging parameters for digital distribution channels.</p>
            
            <form onSubmit={handleCreateCarSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Make</label><input type="text" value={newCar.make} onChange={e => setNewCar({...newCar, make: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" required /></div>
                <div><label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Model</label><input type="text" value={newCar.model} onChange={e => setNewCar({...newCar, model: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" required /></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* UPDATED SYSTEM DROP DOWN MATRIX CHIPS SELECTION */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Classification</label>
                  <select value={newCar.type} onChange={e => setNewCar({...newCar, type: e.target.value})} className="w-full px-2 py-2 border bg-white rounded-lg text-sm focus:outline-none">
                    {CAR_TYPES.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Price ($)</label><input type="number" value={newCar.price} onChange={e => setNewCar({...newCar, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" required /></div>
                <div><label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Year</label><input type="number" value={newCar.year} onChange={e => setNewCar({...newCar, year: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" required /></div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">Supplementary Description Context</label>
                <textarea rows="3" value={newCar.description} onChange={e => setNewCar({...newCar, description: e.target.value})} placeholder="Describe performance history..." className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none" />
              </div>
              <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center hover:bg-gray-50 transition">
                <label className="cursor-pointer">
                  <span className="text-xs font-bold text-orange-600 block">Staging Portfolio Matrix File Selection</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => handleMultiImageChange(e, newCar, setNewCar)} className="hidden" disabled={newCar.images.length >= 12} />
                  <span className="text-[10px] text-gray-400 block mt-0.5">({newCar.images.length} / 12 Loaded)</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-xs font-bold transition">Publish Stock Asset</button>
                <button type="button" onClick={() => setActiveView('catalog')} className="px-4 py-2 border rounded-lg text-xs text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: PROFILE INTERFACE */}
        {activeView === 'profile' && currentUser && (
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800">{currentUser.username} Profile Account</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Role Status: <span className="font-bold text-orange-600 uppercase">{currentUser.role}</span></p>
              </div>
              <div className="flex gap-4">
                {(currentUser.role === 'Seller' || currentUser.role === 'Admin') && (
                  <div className="text-right bg-slate-50 border p-3 rounded-xl">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Cars Listed</span>
                    <span className="text-xl font-black text-slate-800">{cars.filter(c => c.owner === currentUser.username).length}</span>
                  </div>
                )}
                <div className="text-right bg-slate-50 border p-3 rounded-xl">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Watched Items</span>
                  <span className="text-xl font-black text-slate-800">{savedListings.length}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* PANEL A: SHOW SELLER STOCK LISTINGS */}
              {(currentUser.role === 'Seller' || currentUser.role === 'Admin') && (
                <div>
                  <h3 className="text-md font-bold mb-3 text-slate-700">🏭 Staged Platform Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cars.filter(c => c.owner === currentUser.username).map(car => (
                      <div key={car.id} className="bg-white border p-4 rounded-xl flex gap-4 items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <img src={car.images?.[0]} className="w-16 h-12 object-cover rounded bg-gray-100" alt="" />
                          <div>
                            <span className="font-bold text-sm block">{car.make} {car.model}</span>
                            <span className="text-xs font-medium text-orange-600 uppercase tracking-tight">{car.type}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={(e) => openEditInterface(car, e)} className="px-2.5 py-1.5 text-xs font-bold border rounded-lg text-amber-700 hover:bg-amber-50">Edit</button>
                          <button onClick={(e) => handleDeleteCar(car.id, e)} className="px-2.5 py-1.5 text-xs font-bold border rounded-lg text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                    ))}
                    {cars.filter(c => c.owner === currentUser.username).length === 0 && <p className="text-xs text-gray-400 italic">No registered stock items mapped to your name.</p>}
                  </div>
                </div>
              )}

              {/* PANEL B: ALWAYS-ON PERSONAL WATCHLIST FOR ALL ROLE PROFILES */}
              <div>
                <h3 className="text-md font-bold mb-3 text-slate-700">❤️ My Watching Wishlist Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.filter(c => savedListings.includes(c.id)).map(car => (
                    <div key={car.id} className="bg-white border p-4 rounded-xl flex gap-4 items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <img src={car.images?.[0]} className="w-16 h-12 object-cover rounded bg-gray-100" alt="" />
                        <div>
                          <span className="font-bold text-sm block">{car.make} {car.model}</span>
                          <span className="text-xs text-gray-400 font-medium">{car.year} • {car.type}</span>
                        </div>
                      </div>
                      <button onClick={() => openDetailModal(car)} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold">View Details</button>
                    </div>
                  ))}
                  {savedListings.length === 0 && <p className="text-xs text-gray-400 italic">Your watchlist dashboard matrix is empty.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: SYSTEM ADMINISTRATIVE CORE */}
        {activeView === 'admin' && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-black mb-4 text-red-600">Global Registry Sweep Console</h2>
            <div className="space-y-2">
              {cars.map(car => (
                <div key={car.id} className="flex items-center justify-between p-3 bg-slate-50 border rounded-xl text-sm">
                  <div><span className="font-bold text-slate-800">{car.make} {car.model}</span> <span className="text-xs text-gray-400">({car.type}) By: @{car.owner}</span></div>
                  <button onClick={(e) => handleDeleteCar(car.id, e)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100 transition">Drop Asset 🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MAXI-VIEW DETAIL MODAL SCREEN */}
      {selectedDetailCar && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border w-full max-w-5xl max-h-[92vh] overflow-y-auto relative flex flex-col md:flex-row">
            
            <button onClick={() => setSelectedDetailCar(null)} className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white p-2.5 rounded-full z-30 shadow-md transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* LEFT COLUMN: MULTIMEDIA SLIDER */}
            <div className="w-full md:w-3/5 bg-slate-950 flex flex-col justify-between relative min-h-[350px] sm:min-h-[460px] md:h-auto border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex-1 relative flex items-center justify-center group overflow-hidden">
                <img src={selectedDetailCar.images?.[activeImageIndex]} alt="" className="w-full h-full object-contain max-h-[480px] select-none pointer-events-none" />

                <button onClick={handlePrevImage} className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
                <button onClick={handleNextImage} className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>

                <span className="absolute bottom-4 right-4 bg-slate-900/80 text-white px-2.5 py-1 rounded-md text-xs font-black tracking-widest">{activeImageIndex + 1} / {selectedDetailCar.images?.length}</span>
              </div>

              <div className="bg-slate-900/60 p-3 flex gap-2 overflow-x-auto border-t border-white/5 scrollbar-thin">
                {selectedDetailCar.images?.map((img, i) => (
                  <button key={i} onClick={() => setActiveImageIndex(i)} className={`h-14 w-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition ${activeImageIndex === i ? 'border-orange-500 scale-95 shadow-lg' : 'border-transparent opacity-50'}`}><img src={img} className="w-full h-full object-cover" alt="" /></button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: METRICS & VALUES */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-sm tracking-wider">{selectedDetailCar.type}</span>
                  <span className="text-xs text-gray-400 font-bold">ID: #{selectedDetailCar.id}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedDetailCar.make} <span className="text-gray-500 font-medium">{selectedDetailCar.model}</span></h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Listed under verification nodes by user: <span className="text-slate-700 font-bold">@{selectedDetailCar.owner}</span></p>

                <div className="mt-6 border-b pb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Asset Evaluation Assessment</span>
                  <span className="text-4xl font-black text-slate-950">${selectedDetailCar.price.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-6">
                  <div className="bg-slate-50 border p-3 rounded-xl"><span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5">Production Year</span><span className="text-sm font-black text-slate-800">{selectedDetailCar.year}</span></div>
                  <div className="bg-slate-50 border p-3 rounded-xl"><span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5">Transmission</span><span className="text-sm font-black text-slate-800">{selectedDetailCar.transmission}</span></div>
                  <div className="bg-slate-50 border p-3 rounded-xl"><span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5">Fuel Supply Type</span><span className="text-sm font-black text-slate-800">{selectedDetailCar.fuelType}</span></div>
                  <div className="bg-slate-50 border p-3 rounded-xl"><span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5">Classification Type</span><span className="text-sm font-black text-orange-600 uppercase truncate">{selectedDetailCar.type}</span></div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Seller Remarks Portfolio Summary</span>
                  <div className="text-sm text-gray-600 leading-relaxed bg-orange-50/50 border border-orange-100 p-4 rounded-xl font-medium italic">"{selectedDetailCar.description}"</div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t flex gap-2">
                <button onClick={(e) => { toggleSaveListing(selectedDetailCar.id, e); }} className={`flex-1 font-bold py-3 text-xs rounded-xl border text-center transition flex items-center justify-center gap-2 ${savedListings.includes(selectedDetailCar.id) ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>❤️ {savedListings.includes(selectedDetailCar.id) ? 'Remove Watchlist' : 'Add to Watchlist'}</button>
                <button onClick={() => alert(`Communication gateway initiated targeting owner pipeline @${selectedDetailCar.owner}`)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-xs rounded-xl text-center transition">💬 Message Dealer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 2: EDIT CAR OBJECT FORM COMPONENT */}
      {editingCar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingCar(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            <h2 className="text-lg font-black mb-1">Edit Stock Item Profile</h2>
            <p className="text-xs text-gray-400 border-b pb-2 mb-4">Modify existing asset parameters, classification metrics, and image layouts.</p>
            
            <form onSubmit={handleUpdateCarSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Make</label><input type="text" value={editingCar.make} onChange={e => setEditingCar({...editingCar, make: e.target.value})} className="w-full px-3 py-1.5 border text-sm rounded-lg focus:outline-none" required /></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Model</label><input type="text" value={editingCar.model} onChange={e => setEditingCar({...editingCar, model: e.target.value})} className="w-full px-3 py-1.5 border text-sm rounded-lg focus:outline-none" required /></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* INLINE EDITABLE METADATA SELECTION TYPE CONFIGURATION */}
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Classification</label>
                  <select value={editingCar.type} onChange={e => setEditingCar({...editingCar, type: e.target.value})} className="w-full px-2 py-1.5 border bg-white text-xs rounded-lg focus:outline-none font-bold text-orange-600">
                    {CAR_TYPES.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Price ($ USD)</label><input type="number" value={editingCar.price} onChange={e => setEditingCar({...editingCar, price: parseFloat(e.target.value) || ''})} className="w-full px-3 py-1.5 border text-sm rounded-lg focus:outline-none" required /></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Year</label><input type="number" value={editingCar.year} onChange={e => setEditingCar({...editingCar, year: parseInt(e.target.value) || ''})} className="w-full px-3 py-1.5 border text-sm rounded-lg focus:outline-none" required /></div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Item Description</label>
                <textarea rows="2" value={editingCar.description} onChange={e => setEditingCar({...editingCar, description: e.target.value})} className="w-full px-3 py-1.5 border text-sm rounded-lg focus:outline-none resize-none" required />
              </div>

              {/* PHOTO STAGING MATRIX */}
              <div className="border border-slate-200 bg-slate-50 rounded-xl p-3">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">Manage Listing Media Portfolio</span>
                
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {editingCar.images?.map((img, idx) => (
                    <div key={idx} className="h-14 bg-white rounded border relative overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImageFromEdit(idx)}
                        className="absolute inset-0 bg-red-600/90 text-white font-bold text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 uppercase tracking-tight"
                      >
                        Delete ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-dashed p-3 rounded-lg text-center">
                  <label className="cursor-pointer block">
                    <span className="text-xs font-bold text-orange-600 hover:underline">➕ Inject Asset Photos</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => handleMultiImageChange(e, editingCar, setEditingCar)} 
                      className="hidden" 
                      disabled={editingCar.images?.length >= 12} 
                    />
                    <span className="text-[9px] text-gray-400 block mt-0.5">({editingCar.images?.length || 0} / 12 Loaded Max)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition">Save Updates</button>
                <button type="button" onClick={() => setEditingCar(null)} className="px-4 py-2 border rounded-lg text-xs text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUTHENTICATION MATRIX */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleLoginSubmit} className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative">
            <button type="button" onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h3 className="text-lg font-black text-center mb-4">Carbeit Authentication</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Username</label><input type="text" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="w-full px-3 py-2 border text-sm rounded-lg focus:outline-none" required /></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Password</label><input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full px-3 py-2 border text-sm rounded-lg focus:outline-none" required /></div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Access Role Privilege Matrix</label>
                <select value={roleInput} onChange={e => setRoleInput(e.target.value)} className="w-full bg-white px-2 py-2 border text-sm rounded-lg focus:outline-none font-medium">
                  <option value="Buyer">Buyer (Default Watchlist Matrix)</option>
                  <option value="Seller">Seller (Studio & Management Enabled)</option>
                  <option value="Admin">Admin (Full Overriding privileges)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg text-sm transition mt-5">Sign In Profile</button>
          </form>
        </div>
      )}

      {/* INFORMATION POP-UPS */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button onClick={() => setIsAboutModalOpen(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h2 className="text-lg font-black mb-2">About Carbeit Multi-Tier System</h2>
            <p className="text-sm text-gray-600 leading-relaxed">Welcome to Carbeit, a dynamic, full-stack single-page web application designed for the modern automotive marketplace. Built from scratch with React and styled using Tailwind CSS, Carbeit serves as an interactive car trading platform that smoothly handles different user roles, complex filtering, and live media management.</p>
            <button onClick={() => setIsAboutModalOpen(false)} className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-xs transition mt-4">Close Info</button>
          </div>
        </div>
      )}

      {/* SUPPORT HELPDESK */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h2 className="text-lg font-black text-center mb-4">Contact System Support</h2>
            <form onSubmit={e => { e.preventDefault(); alert('Log metrics shared with maintainer desk.'); setIsContactModalOpen(false); }} className="space-y-3">
              <input type="email" placeholder="name@domain.com" className="w-full px-3 py-1.5 border text-xs rounded-lg focus:outline-none" required />
              <textarea rows="3" placeholder="Context parameters..." className="w-full px-3 py-1.5 border text-xs rounded-lg resize-none focus:outline-none" required />
              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2 rounded-lg text-xs transition">Transmit Logs</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}