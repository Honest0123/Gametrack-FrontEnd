export async function fetchWithFallback(apiUrl, fallbackRelativePath, options = {}) {
  // Try API first
  try {
    const res = await fetch(apiUrl, options);
    if (res && res.ok) {
      // attempt json parse
      try { const data = await res.json(); return { source: 'api', data }; } catch(e) { return { source: 'api', data: null }; }
    }
    console.warn('API fetch failed or returned non-ok:', res && res.status);
  } catch (err) {
    console.warn('API fetch error:', err);
  }

  // Fallback to static file in public/
  try {
    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    const fallbackPath = fallbackRelativePath.replace(/^\//, '');
    const fallbackUrl = normalizedBase + fallbackPath;
    const res2 = await fetch(fallbackUrl);
    if (res2 && res2.ok) {
      try { const data = await res2.json(); return { source: 'fallback', data }; } catch(e) { return { source: 'fallback', data: null }; }
    }
    throw new Error('Fallback fetch failed: ' + (res2 && res2.status));
  } catch (err) {
    console.error('Fallback fetch error:', err);
    throw err;
  }
}

export async function postWithQueue(apiUrl, payload, queueKey = 'pendingPosts', options = {}) {
  try {
    const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(options.headers||{}) }, body: JSON.stringify(payload), ...options });
    if (res && res.ok) {
      try { const data = await res.json(); return { ok: true, source: 'api', data }; } catch(e) { return { ok: true, source: 'api', data: null }; }
    }
    console.warn('POST failed, status:', res && res.status);
    throw new Error('POST failed ' + (res && res.status));
  } catch (err) {
    console.warn('POST/network failed, queueing locally:', err);
    const localEntry = { ...payload, _id: 'local-' + Date.now(), fechaCreacion: new Date().toISOString() };
    try {
      const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
      queue.push(localEntry);
      localStorage.setItem(queueKey, JSON.stringify(queue));
    } catch (e) { console.warn('Failed to persist queue', e); }
    return { ok: false, source: 'local', data: localEntry };
  }
}

export async function syncPending(queueKey = 'pendingPosts', apiUrlBase = '') {
  const pending = JSON.parse(localStorage.getItem(queueKey) || '[]');
  if (!Array.isArray(pending) || pending.length === 0) return { ok: true, synced: 0 };
  let synced = 0;
  const remaining = [];
  for (const item of pending) {
    try {
      const url = apiUrlBase || `${import.meta.env.VITE_API_URL}/api/Games/reviews`;
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
      if (res.ok) {
        synced++;
        continue;
      }
      remaining.push(item);
    } catch (e) {
      remaining.push(item);
    }
  }
  localStorage.setItem(queueKey, JSON.stringify(remaining));
  return { ok: true, synced, remaining };
}
