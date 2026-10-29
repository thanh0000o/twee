import { type FC, useEffect } from 'react';
import { useLocation } from 'wouter';

/** The guestbook now lives on the blog+links page; old links land there. */
export const Guestbook: FC = () => {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate('/blog-links#guestbook', { replace: true });
  }, [navigate]);
  return null;
};
