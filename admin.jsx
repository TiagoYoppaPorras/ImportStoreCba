const { useState, useEffect } = React;

// Fallback data if DB is empty
const defaultData = {
  vapes: { tabLabel: '💨 Vapes', title: 'Los más vendidos', items: [{ id: 'ignite', name: 'Ignite V40', priceStr: '$13.000', img: 'assets/images/ignite_v40.png' }] },
  perfumesArabes: { tabLabel: '🌹 Perfumes', title: 'Árabes', items: [] },
  perfumesDiseno: { tabLabel: '💎 Diseñador', title: 'Internacionales', items: [] },
  accesorios: { tabLabel: '🎧 Accesorios', title: 'Tecnología', items: [] },
  cuidadoCapilar: { tabLabel: '💆 Capilar', title: 'Karseell', items: [] }
};

function AdminPanel() {
  const [secret, setSecret] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Editor state
  const [activeCategory, setActiveCategory] = useState('vapes');
  const [editingItem, setEditingItem] = useState(null);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json && !json.empty) {
        setData(json);
      } else {
        setData(defaultData); // Load default dummy if empty
      }
    } catch (err) {
      setMsg('Error al conectar con la base de datos.');
      setData(defaultData); // Fallback
    }
    setLoading(false);
  };

  const saveCatalog = async () => {
    setLoading(true);
    setMsg('Guardando...');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (res.ok) {
        setMsg('¡Guardado exitoso!');
      } else {
        setMsg(json.error || 'Error al guardar.');
      }
    } catch (err) {
      setMsg('Error de red al intentar guardar.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(secret.trim().length > 0) {
      setMsg('Validando...');
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`
          },
          body: JSON.stringify({ action: 'verify' })
        });
        if (res.ok) {
          setMsg('');
          setLoggedIn(true);
        } else {
          setMsg('Contraseña incorrecta, intente de nuevo.');
        }
      } catch (err) {
        setMsg('Error de conexión al validar.');
      }
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <p className="text-sm text-gray-500 mb-4 text-center">Ingresá tu contraseña de Vercel</p>
          {msg && <p className={`text-sm mb-4 text-center font-bold ${msg === 'Validando...' ? 'text-blue-500' : 'text-red-500'}`}>{msg}</p>}
          <input 
            type="password" 
            value={secret} 
            onChange={e => setSecret(e.target.value)}
            className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Contraseña secreta"
            required
          />
          <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition">Ingresar</button>
        </form>
      </div>
    );
  }

  if (!data) return <div className="text-center mt-20">Cargando catálogo...</div>;

  const categories = Object.keys(data);
  const currentItems = data[activeCategory]?.items || [];

  const handleDelete = (id) => {
    if(confirm('¿Seguro que querés eliminar este producto?')) {
      const newData = {...data};
      newData[activeCategory].items = newData[activeCategory].items.filter(i => i.id !== id);
      setData(newData);
    }
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id') || Date.now().toString();
    const newItem = {
      id,
      name: formData.get('name'),
      product: formData.get('name'),
      priceStr: formData.get('priceStr'),
      img: formData.get('img'),
      desc: formData.get('desc'),
      variants: formData.get('variants') ? formData.get('variants').split(',').map(s=>s.trim()) : null,
      variantId: formData.get('variants') ? `var-${id}` : null
    };

    const newData = {...data};
    const existingIndex = newData[activeCategory].items.findIndex(i => i.id === editingItem?.id);
    
    if (existingIndex >= 0) {
      newData[activeCategory].items[existingIndex] = { ...newData[activeCategory].items[existingIndex], ...newItem };
    } else {
      newData[activeCategory].items.push(newItem);
    }

    setData(newData);
    setEditingItem(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">📦 Panel ImportStoreCba</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-500">{msg}</span>
          <button disabled={loading} onClick={saveCatalog} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-bold shadow-md disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Cambios Nube'}
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm tracking-wider">Categorías</h3>
          {categories.map(key => (
            <button 
              key={key} 
              onClick={() => { setActiveCategory(key); setEditingItem(null); }}
              className={`text-left px-4 py-3 rounded transition ${activeCategory === key ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {data[key].tabLabel}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {!editingItem ? (
            <div className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{data[activeCategory]?.title} ({currentItems.length})</h2>
                <button onClick={() => setEditingItem({})} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                  + Agregar Producto
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map(item => (
                  <div key={item.id} className="border p-4 rounded flex flex-col items-center text-center relative hover:shadow-lg transition bg-gray-50">
                    <img src={item.img} alt={item.name} className="h-32 object-contain mb-4" />
                    <strong className="text-lg">{item.name}</strong>
                    <span className="text-green-600 font-bold my-2">{item.priceStr}</span>
                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">{item.desc}</p>
                    <div className="mt-4 flex gap-2 w-full">
                      <button onClick={() => setEditingItem(item)} className="flex-1 bg-gray-200 text-gray-800 py-1 rounded text-sm hover:bg-gray-300">Editar</button>
                      <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-100 text-red-600 py-1 rounded text-sm hover:bg-red-200">Borrar</button>
                    </div>
                  </div>
                ))}
                {currentItems.length === 0 && <p className="col-span-full text-center text-gray-500 py-8">No hay productos en esta categoría.</p>}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-6">{editingItem.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <form onSubmit={handleSaveItem} className="flex flex-col gap-4">
                {editingItem.id && <input type="hidden" name="id" value={editingItem.id} />}
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre del Producto</label>
                  <input name="name" defaultValue={editingItem.name} required className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Ej: Ignite V40" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Precio (en string)</label>
                    <input name="priceStr" defaultValue={editingItem.priceStr} required className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Ej: $15.000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ruta Imagen</label>
                    <input name="img" defaultValue={editingItem.img} required className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" placeholder="assets/images/foto.png" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Descripción corta</label>
                  <textarea name="desc" defaultValue={editingItem.desc} className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" rows="2"></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sabores/Variantes (Separado por comas, dejar en blanco si no tiene)</label>
                  <input name="variants" defaultValue={editingItem.variants?.join(', ')} className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Fresa, Menta, Uva" />
                </div>

                <div className="flex gap-4 mt-4">
                  <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Cancelar</button>
                  <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-bold">Guardar en Tabla</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminPanel />);
