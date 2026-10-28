import { useEffect, useState } from 'react';
import { getVisitorCount, recordVisitor } from '@workspace/api-client-react';

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let disposed = false;
    let registered = false;
    let registering = false;
    let interacted = false;
    let ready = false;
    const liveOrigins = ['https://thanhlambeetstwee.com', 'https://thanhlambeetstwee.replit.app'];
    const eligible = liveOrigins.includes(window.location.origin)
      && !navigator.webdriver && window.top === window.self;
    // Required by the existing API contract only; the server identifies visitors by IP.
    const browserId = crypto.randomUUID();

    async function refresh() {
      try {
        const result = await getVisitorCount();
        if (!disposed) {
          setCount(result.count);
          setUnavailable(false);
        }
      } catch {
        if (!disposed) setUnavailable(true);
      }
    }
    async function registerIfEligible() {
      if (disposed || registered || registering || !eligible || !ready
        || !interacted || document.visibilityState !== 'visible') return;
      registering = true;
      try {
        const result = await recordVisitor({ visitorId: browserId });
        registered = true;
        if (!disposed) {
          setCount(result.count);
          setUnavailable(false);
        }
      } catch {
        // Keep the read-only total; a later interaction can retry registration.
      } finally {
        registering = false;
      }
    }
    function onInteraction(event: Event) {
      if (!event.isTrusted || document.visibilityState !== 'visible') return;
      interacted = true;
      void registerIfEligible();
    }
    const events = ['pointerdown', 'keydown', 'wheel'] as const;
    if (eligible) {
      events.forEach(event => window.addEventListener(event, onInteraction, { passive: true }));
      document.addEventListener('visibilitychange', registerIfEligible);
    }
    const registrationDelay = window.setTimeout(() => {
      ready = true;
      void registerIfEligible();
    }, 8000);
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60_000);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.clearTimeout(registrationDelay);
      events.forEach(event => window.removeEventListener(event, onInteraction));
      document.removeEventListener('visibilitychange', registerIfEligible);
    };
  }, []);

  return (
    <span className="home-visitor-count" title="Corrected total: 116, plus new IP addresses after activity on the live site. Previews and recognised bots are excluded. This is an estimate, not a verified count of people.">
      <span className="home-nav-sphere home-nav-sphere-green home-control-sphere" aria-hidden="true" />
      <span>{`{visitors: ${unavailable ? 'unavailable' : count === null ? '…' : count.toLocaleString('en-US')}}`}</span>
    </span>
  );
}
