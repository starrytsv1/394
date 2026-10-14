'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide';
import { MorphButton } from './morph-ui';

export function NewsGallery({ images, title }: { images: string[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  function move(step: number) {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, index + step));
    el.scrollTo({ left: next * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  return <div className={`news-gallery${images[0] === '/news/rule-taproom.jpg' ? ' news-gallery--poster' : ''}${images[0] === '/news/zagovor-pivnaya-dieta-october-2026.jpg' ? ' news-gallery--event-poster' : ''}`}>
    <div className="news-gallery-media">
    <div className="news-gallery-track" ref={track} role="region" aria-label={`Фотографии: ${title}`} tabIndex={0}
      onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}
      onScroll={event => { const el = event.currentTarget; if (el.clientWidth) setIndex(Math.min(images.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)))); }}>
      {images.map((src, i) => <div className="news-gallery-slide" key={src}><img src={src} alt={`${title} — фото ${i + 1}`} loading="lazy" decoding="async" draggable={false}/></div>)}
    </div>
    {images.length > 1 && <div className="news-gallery-controls" aria-label={`Листать фотографии: ${title}`}>
      {index > 0 && <MorphButton className="news-gallery-prev" type="button" from={ChevronLeft} to={ChevronLeft} iconSize={24} aria-label={`Предыдущее фото: ${title}`} onClick={() => move(-1)}/>}
      <span aria-live="polite">{index + 1}/{images.length}</span>
      {index < images.length - 1 && <MorphButton className="news-gallery-next" type="button" from={ChevronRight} to={ChevronRight} iconSize={24} aria-label={`Следующее фото: ${title}`} onClick={() => move(1)}/>}
    </div>}
    </div>
    <div className="news-gallery-heading"><h3>{title}</h3></div>
  </div>;
}
