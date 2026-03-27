const { useState, useEffect } = React;

const productsData = {
  vapes: {
    id: 'vapes',
    tabLabel: '💨 Vapes',
    title: 'Los más vendidos',
    sub: 'Modelos de alta duración con los mejores sabores importados',
    ctaLink: 'https://wa.me/5493804524621?text=Hola,%20quiero%20consultar%20disponibilidad%20de%20vapes',
    ctaText: '💬 Consultar disponibilidad de vapes',
    theme: '',
    items: [
      {
        id: 'ignite-v40',
        product: 'Ignite V40',
        priceStr: '$13.000',
        badge: { classStr: 'product-card__badge--hot', text: '🔥 Más accesible' },
        img: 'assets/images/ignite_v40.png',
        name: 'Ignite V40',
        desc: 'Vape desechable premium. Sabores intensos de larga duración.',
        variants: ['Mixed Berries', 'Strawberry Watermelon', 'Watermelon Ice', 'Strawberry Banana', 'Peach Mango Watermelon'],
        variantId: 'ignite-sabor'
      },
      {
        id: 'orion-bar-10k',
        cardClass: 'product-card--featured',
        product: 'Lost Vape Orion Bar 10K',
        priceStr: '$18.000',
        badge: { classStr: 'product-card__badge--star', text: '⭐ Más elegido' },
        img: 'assets/images/orion_bar.png',
        imgClass: 'img--contain',
        name: 'Lost Vape Orion Bar',
        desc: '10.000 Puffs · El equilibrio perfecto entre calidad y precio.',
        variants: ['Blue Razz Ice', 'Peach Mango Watermelon', 'Strawberry Summertime', 'Strawberry Chew', 'Raspberry Sour Apple'],
        variantId: 'orion-sabor'
      },
      {
        id: 'elfbar-trio-40k',
        product: 'Elf Bar Trio 40K',
        priceStr: '$31.500',
        badge: { classStr: 'product-card__badge--crown', text: '👑 Alta duración' },
        img: 'assets/images/elfbar_trio.png',
        imgClass: 'img--contain',
        name: 'Elf Bar Trio',
        desc: '40.000 Puffs · El dispositivo premium de mayor duración del mercado.',
        variants: ['Blue Razz Ice', 'Watermelon Ice', 'Sour Apple Ice'],
        variantId: 'elfbar-sabor'
      }
    ]
  },
  perfumesArabes: {
    id: 'perfumes-arabes',
    tabLabel: '🌹 Perfumes Árabes',
    title: 'Fragancias del Medio Oriente',
    sub: 'Importados directamente. Ideales para regalo. Stock limitado.',
    ctaLink: 'https://wa.me/5493804524621?text=Hola,%20quiero%20consultar%20disponibilidad%20de%20perfumes%20árabes',
    ctaText: '💬 Consultar disponibilidad',
    theme: 'products-section--dark',
    gridClass: 'products-grid--perfumes',
    items: [
      {
        id: 'armaf-clubnuit',
        cardClass: 'product-card--perfume',
        product: 'Armaf – Club de Nuit Blue Iconic',
        priceStr: '$67.999',
        img: 'assets/images/perfume_armaf_clubnuit.png',
        imgClass: 'img--contain',
        brand: 'Armaf',
        name: 'Club de Nuit Blue Iconic'
      },
      {
        id: 'lattafa-asad',
        cardClass: 'product-card--perfume',
        product: 'Lattafa – Asad Bournon',
        priceStr: '$68.000',
        img: 'assets/images/perfume_lattafa_asad.png',
        imgClass: 'img--contain img--lg',
        brand: 'Lattafa',
        name: 'Asad Bournon'
      },
      {
        id: 'lattafa-khamrah',
        cardClass: 'product-card--perfume',
        product: 'Lattafa – Khamrah Black',
        priceStr: '$45.999',
        img: 'assets/images/perfume_lattafa_khamrah.png',
        brand: 'Lattafa',
        name: 'Khamrah Black'
      },
      {
        id: 'lattafa-fakhar',
        cardClass: 'product-card--perfume',
        product: 'Lattafa – Fakhar Black EDP 100ml',
        priceStr: '$59.000',
        img: 'assets/images/perfume_lattafa_fakhar.png',
        brand: 'Lattafa',
        name: 'Fakhar Black EDP 100ml'
      }
    ]
  },
  perfumesDiseno: {
    id: 'perfumes-diseno',
    tabLabel: '💎 Perfumes Diseñador',
    title: 'Marcas internacionales',
    sub: 'Las firmas más exclusivas del mundo, disponibles en Córdoba.',
    ctaLink: 'https://wa.me/5493804524621?text=Hola,%20quiero%20consultar%20sobre%20perfumes%20de%20diseñador',
    ctaText: '💬 Consultar disponibilidad',
    theme: '',
    gridClass: 'products-grid--perfumes',
    items: [
      {
        id: 'valentino-roma',
        cardClass: 'product-card--perfume',
        product: 'Valentino – Born in Roma',
        priceStr: '$155.000',
        badge: { classStr: 'product-card__badge--premium', text: '💎 Premium' },
        img: 'assets/images/perfume_valentino.png',
        imgClass: 'img--contain img--sm',
        brand: 'Valentino',
        name: 'Born in Roma'
      },
      {
        id: 'jpg-lemale',
        cardClass: 'product-card--perfume',
        product: 'Jean Paul Gaultier – Le Male Elixir',
        priceStr: '$140.000',
        img: 'assets/images/perfume_jpg_lemale.png',
        brand: 'Jean Paul Gaultier',
        name: 'Le Male Elixir'
      },
      {
        id: 'chanel-bleu',
        cardClass: 'product-card--perfume',
        product: 'Chanel – Bleu de Chanel',
        priceStr: '$149.999',
        badge: { classStr: 'product-card__badge--star', text: '⭐ Top ventas' },
        img: 'assets/images/perfume_chanel_bleu.png',
        brand: 'Chanel',
        name: 'Bleu de Chanel'
      },
      {
        id: 'armani-stronger',
        cardClass: 'product-card--perfume',
        product: 'Giorgio Armani – Stronger With You Absolutely',
        priceStr: '$105.000',
        img: 'assets/images/perfume_armani.png',
        brand: 'Giorgio Armani',
        name: 'Stronger With You Absolutely'
      },
      {
        id: 'versace-eros',
        cardClass: 'product-card--perfume',
        product: 'Versace – Eros',
        priceStr: '$85.000',
        img: 'assets/images/perfume_versace.png',
        brand: 'Versace',
        name: 'Eros'
      },
      {
        id: 'ysl-myself',
        cardClass: 'product-card--perfume',
        product: 'Yves Saint Laurent – Myself Le Parfum',
        priceStr: '$155.000',
        badge: { classStr: 'product-card__badge--premium', text: '💎 Premium' },
        img: 'assets/images/perfume_ysl.png',
        imgClass: 'img--contain img--sm',
        brand: 'Yves Saint Laurent',
        name: 'Myself Le Parfum'
      }
    ]
  },
  accesorios: {
    id: 'accesorios',
    tabLabel: '🎧 Accesorios',
    title: 'Tecnología premium',
    sub: 'Los dispositivos más buscados del momento.',
    ctaLink: 'https://wa.me/5493804524621?text=Hola,%20quiero%20consultar%20disponibilidad%20de%20los%20AirPods%20Pro',
    ctaText: '💬 Consultar disponibilidad',
    theme: 'products-section--dark',
    gridClass: 'products-grid--single',
    items: [
      {
        id: 'airpods-pro',
        cardClass: 'product-card--featured',
        product: 'AirPods Pro 2da Generación (Simil)',
        priceStr: '$19.990',
        badge: { classStr: 'product-card__badge--hot', text: '🔥 Muy buscado' },
        img: 'assets/images/airpods_pro.png',
        name: 'AirPods Pro 2da Generación',
        desc: 'Simil. Cancelación activa de ruido, calidad de audio superior, estuche de carga.'
      }
    ]
  },
  cuidadoCapilar: {
    id: 'cuidado-capilar',
    tabLabel: '💆 Capilar',
    title: 'Karseell – Tratamiento profesional',
    sub: 'La línea capilar importada que está revolucionando el mercado.',
    ctaLink: 'https://wa.me/5493804524621?text=Hola,%20quiero%20consultar%20sobre%20los%20productos%20Karseell',
    ctaText: '💬 Consultar sobre Karseell',
    theme: '',
    gridClass: 'products-grid--duo',
    items: [
      {
        id: 'karseell-crema',
        product: 'Karseell Crema Capilar 500ml',
        priceStr: '$20.000',
        img: 'assets/images/karseell_crema.png',
        brand: 'Karseell',
        name: 'Crema Capilar 500ml',
        desc: 'Tratamiento profundo con aceites naturales. Hidratación intensa y recuperación del cabello dañado.'
      },
      {
        id: 'karseell-aceite',
        product: 'Karseell Aceite Capilar 50ml',
        priceStr: '$18.000',
        img: 'assets/images/karseell_aceite.png',
        imgClass: 'img--contain img--sm',
        brand: 'Karseell',
        name: 'Aceite Capilar 50ml',
        desc: 'Aceite esencial concentrado. Brillo, suavidad y control del frizz desde la primera aplicación.'
      }
    ]
  }
};

function ProductCard({ item }) {
  const handleAddToCart = (e) => {
    // Simulamos el botón original para que la función global addToCart funcione
    const btn = e.currentTarget;
    if (window.addToCart) {
      window.addToCart(btn);
    }
  };

  return (
    <article className={`product-card ${item.cardClass || ''}`} data-product={item.product} data-price={item.priceStr}>
      {item.badge && (
        <div className={`product-card__badge ${item.badge.classStr}`}>
          {item.badge.text}
        </div>
      )}
      <div className="product-card__image-wrap">
        <img src={item.img} alt={item.name} className={`product-card__image ${item.imgClass || ''}`} loading="lazy" />
      </div>
      <div className="product-card__body">
        {item.brand && <p className="product-card__brand">{item.brand}</p>}
        <h3 className="product-card__name">{item.name}</h3>
        {item.desc && <p className="product-card__desc">{item.desc}</p>}
        <div className="product-card__price">{item.priceStr}</div>
        
        {item.variants && (
          <React.Fragment>
            <label className="variant-label" htmlFor={item.variantId}>Elegí tu sabor:</label>
            <select id={item.variantId} className="variant-select" aria-label={`Sabor ${item.name}`}>
              <option value="">— Seleccioná un sabor —</option>
              {item.variants.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </React.Fragment>
        )}
        
        <button 
          className="btn btn--whatsapp btn--block order-btn" 
          data-product={item.product} 
          data-price={item.priceStr} 
          data-select={item.variantId || ''} 
          onClick={handleAddToCart}
        >
          <span className="cart-action-icon">🛒</span>
          Agregar al Carrito
        </button>
      </div>
    </article>
  );
}

function ProductsContainer() {
  const [dbData, setDbData] = useState(productsData);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json && !json.empty && !json.error && Object.keys(json).length > 0) {
          setDbData(json);
        }
      } catch (err) {
        console.warn('Utilizando catálogo estático (API/KV no disponible)');
      }
      setLoadingDb(false);
    };
    fetchCatalog();
  }, []);

  const categories = Object.keys(dbData);
  const [activeTabKey, setActiveTabKey] = useState(categories[0] || 'vapes');
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const key = categories.find(k => dbData[k].id === hash);
        if (key) {
          setActiveTabKey(key);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeCategory = dbData[activeTabKey] || dbData[categories[0]];

  return (
    <div className="react-tabs-container">
      {/* Tab Navigation */}
      <div className="tabs-nav container">
        {categories.map(key => (
          <button 
            key={key} 
            className={`tab-btn ${activeTabKey === key ? 'active' : ''}`}
            onClick={() => setActiveTabKey(key)}
          >
            {dbData[key].tabLabel}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <section 
        className={`products-section ${activeCategory.theme}`} 
        id={activeCategory.id} 
        aria-label={activeCategory.tabLabel}
      >
        <div className="container">
          <div className="section-header animate-fade-in">
            <div className="section-header__label">{activeCategory.tabLabel}</div>
            <h2 className="section-header__title">{activeCategory.title}</h2>
            <p className="section-header__sub">{activeCategory.sub}</p>
          </div>
          
          <div className={`products-grid ${activeCategory.gridClass || ''} animate-slide-up`}>
             {activeCategory.items.map(item => (
               <ProductCard key={item.id} item={item} />
             ))}
          </div>

          <div className="section-cta animate-fade-in">
            <a href={activeCategory.ctaLink} className="btn btn--outline-green" target="_blank" rel="noopener noreferrer">
              {activeCategory.ctaText}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const rootElement = document.getElementById('products-react-root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ProductsContainer />);
}
