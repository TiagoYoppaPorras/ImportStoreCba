/**
 * ImportStoreCba — script.js
 * Lógica de WhatsApp, UI, FAQ, Age Gate, Animaciones
 * Meta Ads Optimizado | Version 2026
 */

/* ══════════════════════════════════════════════════════
   1. CONSTANTES
══════════════════════════════════════════════════════ */
const WA_NUMBER = '5493804524621';
const AGE_KEY   = 'importstorecba_age_ok';

/* ══════════════════════════════════════════════════════
   2. UTILIDADES
══════════════════════════════════════════════════════ */

/**
 * Muestra un toast de notificación por unos segundos
 * @param {string} msg - Mensaje a mostrar
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/**
 * Tracking de eventos (listo para integrar Meta Pixel)
 * @param {string} eventName - Nombre del evento
 * @param {object} [data] - Datos adicionales opcionales
 */
function trackEvent(eventName, data = {}) {
  // Meta Pixel tracking (descomentar cuando tengas el Pixel instalado):
  // if (typeof fbq !== 'undefined') {
  //   fbq('track', eventName, data);
  // }
  console.log(`[Tracking] ${eventName}`, data);
}

/* ══════════════════════════════════════════════════════
   3. SISTEMA DE CARRITO DE COMPRAS
══════════════════════════════════════════════════════ */

let cart = [];

/**
 * Abre el sidebar del carrito
 */
function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.classList.add('no-scroll');
}

/**
 * Cierra el sidebar del carrito
 */
function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

// Cerrar al clickear el fondo oscuro
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

/**
 * Formatea un número a pesos argentinos
 */
function formatCurrency(num) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num);
}

/**
 * Parsea un string de precio (ej: "$18.000") a número entero (18000)
 */
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
}

/**
 * Actualiza la interfaz del carrito (sidebar y badge numérico)
 */
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartBadge = document.getElementById('cartBadge');
  const cartTotalText = document.getElementById('cartTotalText');

  if (!cartItemsContainer || !cartBadge || !cartTotalText) return;

  // Limpiar HTML actual
  cartItemsContainer.innerHTML = '';
  
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    
    // Solo mostrar la variante si existe
    const variantHtml = item.variant ? `<p class="cart-item-variant">Sabor: ${item.variant}</p>` : '';
    
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.product}</h4>
        ${variantHtml}
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
        <span class="cart-qty-num">${item.quantity}</span>
        <button class="cart-qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  // Estado vacío
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Tu carrito está vacío</p>
        <button class="btn btn--outline" onclick="closeCart()" style="margin-top: 1rem;">Seguir viendo</button>
      </div>
    `;
  }

  // Actualizar totales y contadores
  cartBadge.textContent = count;
  cartTotalText.textContent = formatCurrency(total);
  
  // Mostrar o esconder el badge según si hay items
  cartBadge.style.display = count > 0 ? 'flex' : 'none';
}

/**
 * Cambia la cantidad de un producto en el carrito
 */
function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  // Si llega a 0, eliminar producto
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

/**
 * Añade un producto al carrito
 * @param {HTMLElement} btn - Botón clickeado en la tarjeta de producto
 */
function addToCart(btn) {
  const productoStr = btn.dataset.product || 'Producto';
  const priceStr    = btn.dataset.price   || '0';
  const numericPrice = parsePrice(priceStr);
  const selectId    = btn.dataset.select  || null;

  let variante = null;

  // Validación de variante (sabor) para vapes
  if (selectId) {
    const sel = document.getElementById(selectId);
    if (sel) {
      variante = sel.value.trim();
      if (!variante) {
        // Marcar error visual
        sel.classList.add('error');
        sel.addEventListener('change', () => sel.classList.remove('error'), { once: true });
        showToast('⚠️ Por favor, elegí un sabor antes de agregarlo al carrito.');
        
        // Hacer focus en el select y animar un poco
        sel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => sel.focus(), 300);
        return;
      }
    }
  }

  // Verificar si ya existe el producto (exactamente la misma variante si aplica)
  const existingItem = cart.find(item => item.product === productoStr && item.variant === variante);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      product: productoStr,
      price: numericPrice,
      variant: variante,
      quantity: 1
    });
  }

  updateCartUI();
  openCart();

  // Cambio de texto del botón temporal para UX (Feedback visual)
  btn.classList.add('clicked');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '¡Agregado! ✔️';
  
  setTimeout(() => {
    btn.classList.remove('clicked');
    btn.innerHTML = originalHTML;
  }, 1200);

  // Tracking de Meta Pixel
  trackEvent('AddToCart', { content_name: productoStr, value: numericPrice, currency: 'ARS' });
}

/**
 * Finalizar pedido enviando la lista a WhatsApp
 */
function checkoutCart() {
  if (cart.length === 0) {
    showToast('⚠️ Tu carrito está vacío');
    return;
  }

  let totalNum = 0;
  
  // Encabezado del mensaje
  let mensaje = "¡Hola ImportStore! Me gustaría hacer el siguiente pedido:\n\n";
  
  // Listado de productos
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalNum += itemTotal;
    
    mensaje += `🔸 ${item.quantity}x ${item.product}`;
    if (item.variant) {
      mensaje += ` (Sabor: ${item.variant})`;
    }
    // Opcional: mostrar subtotal por item si lleva > 1
    // if (item.quantity > 1) { mensaje += ` - ${formatCurrency(itemTotal)}`; }
    mensaje += `\n`;
  });

  // Total
  mensaje += `\n*TOTAL: ${formatCurrency(totalNum)}*\n\n¿Me confirman disponibilidad por favor?`;

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  
  // Tracking
  trackEvent('InitiateCheckout', { value: totalNum, currency: 'ARS' });
  
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ══════════════════════════════════════════════════════
   4. AGE GATE
══════════════════════════════════════════════════════ */
function initAgeGate() {
  const gate   = document.getElementById('age-gate');
  const btnYes = document.getElementById('age-yes');
  const btnNo  = document.getElementById('age-no');

  if (!gate) return;

  // Si ya verificó edad, ocultar gate inmediatamente
  if (localStorage.getItem(AGE_KEY) === 'true') {
    gate.remove();
    return;
  }

  // Bloquear scroll mientras el gate está activo
  document.body.classList.add('no-scroll');

  btnYes.addEventListener('click', () => {
    localStorage.setItem(AGE_KEY, 'true');
    gate.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    setTimeout(() => gate.remove(), 400);
  });

  btnNo.addEventListener('click', () => {
    window.location.href = 'https://google.com';
  });
}

/* ══════════════════════════════════════════════════════
   5. HEADER SCROLL EFFECT
══════════════════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init
}

/* ══════════════════════════════════════════════════════
   6. MOBILE MENU
══════════════════════════════════════════════════════ */
function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const nav  = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar al hacer click en un link
  nav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ══════════════════════════════════════════════════════
   7. FAQ ACCORDION
══════════════════════════════════════════════════════ */
function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const answer   = question.nextElementSibling;
      const expanded = question.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás
      questions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling?.classList.remove('open');
        }
      });

      // Toggle el actual
      question.setAttribute('aria-expanded', String(!expanded));
      answer?.classList.toggle('open', !expanded);
    });
  });
}

/* ══════════════════════════════════════════════════════
   8. SMOOTH SCROLL (refuerzo para navegadores más viejos)
══════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('header')?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════════════
   9. ANIMATE ON SCROLL (Intersection Observer)
══════════════════════════════════════════════════════ */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll('.product-card, .trust-card, .faq-item');

  // Preparar estado inicial
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Delay escalonado
        const delay = (Array.from(cards).indexOf(entry.target) % 4) * 80;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
}

/* ══════════════════════════════════════════════════════
   10. TRACKING DE BOTONES WHATSAPP (Meta Pixel ready)
══════════════════════════════════════════════════════ */
function initButtonTracking() {
  document.querySelectorAll('[data-event]').forEach(el => {
    el.addEventListener('click', () => {
      const eventName = el.dataset.event;
      trackEvent(eventName);
    });
  });
}

/* ══════════════════════════════════════════════════════
   11. LAZY LOADING (Intersection Observer)
══════════════════════════════════════════════════════ */
function initLazyLoading() {
  if (!('IntersectionObserver' in window)) return;

  const images = document.querySelectorAll('img[loading="lazy"]');

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach(img => imgObserver.observe(img));
}

/* ══════════════════════════════════════════════════════
   12. INIT PRINCIPAL
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initHeader();
  initMobileMenu();
  initFAQ();
  initSmoothScroll();
  initScrollAnimations();
  initButtonTracking();
  initLazyLoading();

  console.log('%c🚀 ImportStoreCba | Developed 2026', 'color: #25d366; font-weight: bold; font-size: 14px;');
});
