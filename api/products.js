import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS setup for local development and production
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ error: 'Falta conectar la base de datos (KV) en Vercel. Las variables de entorno no existen.' });
  }

  const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  
  if (req.method === 'GET') {
    try {
      const data = await kv.get('store_products');
      res.status(200).json(data || { empty: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products from KV' });
    }
  } else if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader ? authHeader.split(' ')[1] : null;

    if (!bearerToken || bearerToken !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: 'Acceso no autorizado. Contraseña incorrecta.' });
    }
    
    try {
      const newData = req.body;
      if (newData && newData.action === 'verify') {
        return res.status(200).json({ success: true, message: 'Valid' });
      }
      await kv.set('store_products', newData);
      res.status(200).json({ success: true, message: 'Catálogo actualizado correctamente en Vercel KV' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el catálogo' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

