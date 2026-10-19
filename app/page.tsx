'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, CircleMinus, CirclePlus, MessageCircle, Minus, MoveDown, Plus, Send } from 'lucide';
import { LegalCompliance } from './legal-compliance';
import { NewsGallery } from './news-gallery';
import { MorphButton, MorphLink } from './morph-ui';
import { keepRussianShortWords } from './typography';

const beers = [
  { id: 'handrails', name: 'Handrails', style: 'New England Double IPA', description: 'Совместная варка с Zagovor Brewery. Плотный New England Double IPA крепостью 8,5%, начальной плотностью 19° Plato и горечью 40 IBU.', abv: '8,5%', hops: '19° Plato · 40 IBU', format: '0,45 л', image: '/optimized/handrails-front-matte-v2.png', imageAlt: 'Банка Handrails — коллаборация Zagovor Brewery и Switch Brewing' },
  { id: 'two-step', name: 'Two-Step', style: 'Triple IPA', description: 'Совместная варка с SALIWA. Triple IPA крепостью 9,5%, горечь 90 IBU. Хмель: Lotus, Riwaka, Strata и Simcoe.', abv: '9,5%', hops: 'Lotus · Riwaka · Strata · Simcoe', format: '', status: '', image: '/optimized/two-step-front.png', imageAlt: 'Банка Two-Step — коллаборация Switch Brewing и SALIWA' },
  { id: 'art', name: 'Площадь Искусств', style: 'Single Hop IPA', description: 'Single Hop IPA. Крепость 6,7%; хмель Citra.', abv: '6.7%', hops: 'Citra', format: '0,5 л', image: '/optimized/ploshchad-can.webp', imageAlt: 'Банка пива Площадь Искусств' },
  { id: 'fury', name: 'Teenage Fury', style: 'Micro IPA', description: 'Micro IPA совместно с Velka Morava. Крепость 3,7%; хмель Magnum, Mosaic и Nectaron.', abv: '3.7%', hops: 'Magnum · Mosaic · Nectaron', format: '0,5 л', price: 260, status: '', image: '/optimized/fury-can.webp', imageAlt: 'Банка пива Teenage Fury' },
  { id: 'code', name: 'CODENAME #LBD026', style: 'Session IPA', description: 'Сессионный IPA, сваренный для Lobotomy Day 2026: невысокая крепость, Mosaic и HBC 522.', abv: '3.6%', hops: 'Mosaic · HBC 522', format: '0,5 л', price: 260, status: '', image: '/optimized/codename-can.webp', imageAlt: 'Банка пива CODENAME LBD026' },
  { id: 'paid', name: 'Оплачено', style: 'Double IPA', description: 'Double IPA. Совместная варка с White Stone.', abv: '—', hops: 'White Stone × Switch', format: '0,5 л', image: '/optimized/oplacheno-front.png', imageAlt: 'Лицевая сторона банки Double IPA Оплачено со скейтбордистом' },
  { id: 'tiki', name: 'Tiki', style: 'American Pale Ale', description: 'APA, сваренный к двухлетию ярославского бара Magnum. В рецепте Mosaic и Strata, крепость 5,5% и горечь 45 IBU. На этикетке — сёрфинг, волна и немного лета.', abv: '5,5%', hops: 'Mosaic · Strata', format: '0,45 л', status: '', image: '/optimized/tiki-front.png', imageAlt: 'Бирюзовая банка Tiki — Switch Brewing × Magnum' },
  { id: 'lemon-hazed', name: 'Lemon Hazed', style: 'Hazy Pale Ale', description: 'Совместная варка с Selfmade. Мутный пэйл-эль на Galaxy и Mosaic Cryo: тропики, цитрусы и ботанические терпены Super Lemon Haze. На банке — граффити, в рецепте — 5,5% крепости.', abv: '5,5%', hops: 'Galaxy · Mosaic Cryo', format: '', status: '', image: '/optimized/lemon-hazed-front.png', imageAlt: 'Жёлтая банка Lemon Hazed — Selfmade × Switch Brewing' },
];
const featuredBeerId = 'handrails';
const tvSummaries: Record<string, string> = {
  'moscow-239': 'Немного хайлайтов о поездке в Москву, к старшим',
  '1628': 'West Coast IPA с Columbus, Centennial, Simcoe, Citra и Mosaic. Пиво и скейтбординг в первом эфире Switch TV.',
  '1645': 'Double IPA с White Stone. Посвящён скейтерскому фейлу Credit Card.',
  '1625': 'Mountain IPA к пятилетию бара «Путч». Хмель: Magnum, Centennial Cryo и Idaho 7 Cryo.',
  '1643': 'American IPA для Ростовского Фестивальчика: двойное охмеление Strata CGX, Citra и CBD.',
  '1626': 'Micro IPA к трёхлетию Stay Gold Pizza Spot. Крепость 3,5%, хмель Galaxy и Motueka.',
  '1642': 'Видеоотчёт с «Заливной»: музыка, гости и пиво. Снято Машей Juicy.',
  '1635': 'Фирменный стакан Switch объёмом 470 мл.',
  '1639': 'Две версии Face Grind: апельсин с лавандой и грейпфрут с лемонграссом. С розовой солью и кориандром.',
  '1637': 'Вечер в Stay Gold с друзьями Switch. Видео Маши Juicy.',
  '1636': 'Switch на первом кране бара Роз в Соляном переулке, Петербург.',
  '1638': 'Архивный ролик о последних банках Иры #3.',
  '1800': '«Вспышка 25/26»: открытие сноубордического сезона в Золотой Долине. Полный фильм о контесте при поддержке Switch.',
  '9457': 'Первое видео о Switch Brewing: пиво, Петербург и скейтбординг. 2023 год.',
  '9953': 'Wasted Summer и летние воспоминания о фестивале «Заливная».',
  '0533': 'American IPA, 6,5%. Хмель Columbus, Mosaic и Idaho 7 Cryo. Выпуск только в кегах.',
};
const tvMobileSummaries: Record<string, string> = {
  'moscow-239': 'Немного хайлайтов о поездке в Москву, к старшим',
  '1628': 'West Coast IPA. Пиво и скейтбординг в первом эфире Switch TV.',
  '1645': 'Double IPA с White Stone — посвящение скейтерскому фейлу Credit Card.',
  '1625': 'Mountain IPA к пятилетию бара «Путч».',
  '1643': 'American IPA для Ростовского Фестивальчика. Strata CGX, Citra и CBD.',
  '1626': 'Micro IPA со Stay Gold. 3,5%, хмель Galaxy и Motueka.',
  '1642': 'Музыка, гости и пиво на «Заливной». Видео Маши Juicy.',
  '1635': 'Фирменный стакан Switch, 470 мл.',
  '1639': 'Апельсин с лавандой или грейпфрут с лемонграссом — две версии Face Grind.',
  '1637': 'Вечер с друзьями в Stay Gold. Видео Маши Juicy.',
  '1636': 'Switch на первом кране бара Роз в Петербурге.',
  '1638': 'Последние банки Иры #3. Видео из архива.',
  '1800': '«Вспышка 25/26»: сноубордический контест в Золотой Долине.',
  '9457': 'Пиво, Петербург и скейтбординг. Первое видео Switch, 2023 год.',
  '9953': 'Wasted Summer: летние воспоминания о «Заливной».',
  '0533': 'American IPA, 6,5%. Columbus, Mosaic и Idaho 7 Cryo. Только в кегах.',
};
const orderedBeers = [...beers].sort((a, b) => Number(b.id === featuredBeerId) - Number(a.id === featuredBeerId));

const editorialStories = [
  { date: '16.10.26', category: 'Тап тейковер', title: 'Zagovor в Пивной Диете', text: 'Zagovor в «Пивной Диете»: хиты и премьера совместного пива со Switch. 16 октября, 19:30, Восстания, 37–39.', href: 'https://t.me/switchbrewing/240', image: '/news/zagovor-pivnaya-dieta-october-2026.jpg', imageAlt: 'Афиша тап тейковера Zagovor и премьеры совместного пива с Switch Brewing' },
  { date: '16.09.26', category: 'Анонс / Zagovor', title: 'Варим с Zagovor', text: 'Съездили к Zagovor и сварили вместе охмелённый сорт. Пока без названия и даты выхода — подробности будут позже.', href: 'https://t.me/switchbrewing/236', image: '/news/zagovor-september-2026.jpg', imageAlt: 'Совместная варка Switch Brewing и Zagovor, сентябрь 2026' },
  { date: '07.09.26', category: 'Гостевые краны / RULE', title: 'Пять кранов в RULE', text: 'В афише RULE taproom — сразу пять наших сортов: Tiki, Lemon Hazed, Teenage Fury, «Оплачено» и Two-Step. От лёгкого APA до тройного IPA.', href: 'https://t.me/switchbrewing/235', image: '/switch-photos/bottles.jpg', imageAlt: 'Бутылки Switch Brewing — иллюстрация к новости о гостевых кранах' },
  { date: '07.09.26', category: 'Фестивали / Фотоотчёт', title: 'Лето отгремело', text: 'Закрыли фестивальный сезон и собрали фотографии. Спасибо всем, кто подходил к нашим кранам, соседям по стендам и организаторам. Увидимся на следующих фестивалях.', href: 'https://www.instagram.com/switchbrewing/p/Dc_RxSBjZoi/', image: '/news/festival-season-2026.jpg', imageAlt: 'Фестивальный отчёт Switch Brewing за 2026 год' },
];

const partners = [
  { name: 'Holy Ribs', image: '/partners-ptichka/holy_ribs_logo_color.png', href: 'https://chuck-family.ru/holy-ribs' },
  { name: 'Brewmasters', image: '/partners-ptichka/site_logo___1.png', href: 'https://vk.com/brewmstrs' },
  { name: 'Krang Pizza', image: '/partners-ptichka/krng.png', href: 'https://chuck-family.ru/krang-pizza' },
  { name: 'Мистерия Chuck', image: '/partners-ptichka/logggo-02.png', href: 'https://chuck-family.ru/misteria-chuck' },
  { name: 'Washing Machine', image: '/partners-ptichka/wm-01.png', href: 'https://wmrecordstore.ru/' },
  { name: 'Пивная диета', image: '/partners-ptichka/pd.png', href: 'https://vk.com/beerdietspb' },
  { name: 'Повод', image: '/partners-ptichka/povod.png' },
  { name: 'Спонтан', image: '/partners-ptichka/spontan-01.png' },
  { name: 'FillinGood', image: '/partners-ptichka/fg.png', href: 'https://fillingood.ru/' },
  { name: 'Crowbar', image: '/partners-ptichka/cwowbar.png', href: 'https://vk.com/crowbarspb' },
  { name: 'Raccoon Brewing', image: '/partners-ptichka/raccoon.png', href: 'https://www.raccoonbrewing.co/' },
  { name: '15/16', image: '/partners-ptichka/1516-01.png', href: 'https://vk.com/beerboutique1516' },
  { name: 'Mr Pinky', image: '/partners-ptichka/mrpinky.svg', href: 'https://mrpinky.ru/' },
  { name: 'Stay Gold', image: '/partners-ptichka/staygold_logo___1.png', href: 'https://staygold.one/' },
  { name: 'Underdog', image: '/partners-ptichka/site_logo-02.png', href: 'https://underdog-moscow.ru/' },
  { name: 'Escapist', image: '/partners-ptichka/site_logo-03.png', href: 'https://escapist.moscow/' },
  { name: 'W&B Traditions', image: '/partners-ptichka/site_logo-04.png', href: 'https://wbtraditions.ru/' },
  { name: 'Сосна и Липа', image: '/partners-ptichka/site_logo-05.png', href: 'https://vk.com/sosnaandlipa' },
  { name: 'Столовая', image: '/partners-ptichka/site_logo-06.png' },
  { name: 'Craft Republic', image: '/partners-ptichka/site_logo-07.png' },
  { name: 'Masts', image: '/partners-ptichka/site_logo-08.png', href: 'https://mastsclub.ru/' },
  { name: 'Coffee Racer', image: '/partners-ptichka/site_logo-09.png', href: 'https://coffee-racer.ru/' },
  { name: 'BOMU', image: '/partners-ptichka/site_logo-10.png', href: 'https://bomu.jp/' },
  { name: 'Kiks', image: '/partners-ptichka/site_logo-11.png' },
  { name: 'Бильярдная «Лузеры»', image: '/partners-ptichka/site_logo-12.png', href: 'https://t.me/losers_k21' },
  { name: 'Putch', image: '/partners-ptichka/site_logo-14.png' },
  { name: 'Totti Works Sucks', image: '/partners-ptichka/site_logo-13.png', href: 'https://vk.com/tottiworksucks' },
];

const partnerSlides = Array.from({ length: Math.ceil(partners.length / 6) }, (_, index) => partners.slice(index * 6, index * 6 + 6));
const switchTvAssetVersion = '345';

const switchTvVideos = [
  { id: 'moscow-239', src: '/videos/switch-tv/moscow-239.mp4', poster: '/videos/switch-tv/moscow-239.jpg', format: 'portrait', aspect: '9 / 16', title: 'Поездка в Москву', tag: 'Москва', story: 'Немного хайлайтов о поездке в Москву, к старшим', href: 'https://t.me/switchbrewing/239' },
  { id: '1628', src: '/videos/switch-tv/img_1628.mp4', poster: '/videos/switch-tv/img_1628.webp', format: 'wide', aspect: '80 / 33', title: 'Switch TV: West Coast IPA', tag: 'Первый эфир', story: 'West Coast IPA на Columbus, Centennial, Simcoe, Citra, Mosaic и Mosaic Cryo. Скейтбординг, короткая попытка и тот самый сухой хмелевой характер.', href: 'https://t.me/switchbrewing/151' },
  { id: '1645', src: '/videos/switch-tv/img_1645.mp4', poster: '/videos/switch-tv/img_1645.webp', format: 'portrait', aspect: '9 / 16', title: 'Оплачено', tag: 'DIPA / скейтбординг', story: '«Credit Card» — тот самый удар доской, который запоминается надолго. DIPA посвящён каждому, кто падал, вставал и снова ехал дальше.', href: 'https://t.me/switchbrewing/229' },
  { id: '1625', src: '/videos/switch-tv/img_1625.mp4', poster: '/videos/switch-tv/img_1625.webp', format: 'portrait', aspect: '9 / 16', title: 'Горная Роса', tag: 'Mountain IPA / Putch', story: 'Mountain IPA к пятилетию новосибирского бара «Путч». В охмелении — Magnum, Centennial Cryo и Idaho 7 Cryo.', href: 'https://t.me/switchbrewing/193' },
  { id: '1643', src: '/videos/switch-tv/img_1643.mp4', poster: '/videos/switch-tv/img_1643.webp', format: 'tall', aspect: '11 / 24', title: 'Стратакостер', tag: 'American IPA', story: 'American IPA с двойным охмелением Strata CGX, щепоткой Citra и CBD — сорт, сваренный специально для Ростовского Фестивальчика.', href: 'https://t.me/switchbrewing/89' },
  { id: '1626', src: '/videos/switch-tv/img_1626.mp4', poster: '/videos/switch-tv/img_1626.webp', format: 'portrait', aspect: '9 / 16', title: 'Pizza Scissors', tag: 'Micro IPA / Stay Gold', story: 'Совместный сорт со Stay Gold Pizza Spot к трёхлетию места. Micro IPA крепостью 3,5% с хмелем Galaxy и Motueka.', href: 'https://t.me/switchbrewing/173' },
  { id: '1642', src: '/videos/switch-tv/img_1642.mp4', poster: '/videos/switch-tv/img_1642.webp', format: 'portrait', aspect: '67 / 120', title: 'Заливная', tag: 'Фестиваль / люди', story: 'Сочный видеоотчёт с «Заливной»: очередь у кранов, знакомые лица, музыка и тот самый общий вайб. Видео собрано Машей Juicy.', href: 'https://t.me/switchbrewing/79' },
  { id: '1635', src: '/videos/switch-tv/img_1635.mp4', poster: '/videos/switch-tv/img_1635.webp', format: 'portrait', aspect: '9 / 16', title: 'Стакань', tag: 'Дистро / 470 мл', story: 'Фирменный стакан объёмом 470 мл с деколью Switch — герой короткого включения и пополнение нашего дистро.', href: 'https://t.me/switchbrewing/62' },
  { id: '1639', src: '/videos/switch-tv/img_1639.mp4', poster: '/videos/switch-tv/img_1639.webp', format: 'landscape', aspect: '40 / 29', title: 'Face Grind × 2', tag: 'Реинкарнация сорта', story: 'Две версии знакомого сорта: красный апельсин с лавандой и грейпфрут с лемонграссом. Розовая соль и кориандр остались на месте.', href: 'https://t.me/switchbrewing/54' },
  { id: '1637', src: '/videos/switch-tv/img_1637.mp4', poster: '/videos/switch-tv/img_1637.webp', format: 'portrait', aspect: '67 / 120', title: 'Вечер в Stay Gold', tag: 'Бар / друзья', story: 'Короткое спасибо всем, кто пришёл в Stay Gold. Живой вечер без постановки, собранный в видео Машей Juicy.', href: 'https://t.me/switchbrewing/23' },
  { id: '1636', src: '/videos/switch-tv/img_1636.mp4', poster: '/videos/switch-tv/img_1636.webp', format: 'portrait', aspect: '9 / 16', title: 'Первый кран в баре Роз', tag: 'Бар / Петербург', story: 'Пиво Switch теперь всегда на первом кране бара Роз в Соляном переулке — короткая хроника этого места.', href: 'https://t.me/switchbrewing/50' },
  { id: '1638', src: '/videos/switch-tv/img_1638.mp4', poster: '/videos/switch-tv/img_1638.webp', format: 'landscape', aspect: '4 / 3', title: 'Последние банки Иры #3', tag: 'Архив / ограниченный выпуск', story: 'Последние две коробки Иры #3 перед тем, как сорт окончательно ушёл в историю. Короткий городской ролик о финальных банках выпуска.', href: 'https://t.me/switchbrewing/16' },
  { id: '1800', src: '/videos/switch-tv/img_1800.mp4', poster: '/videos/switch-tv/img_1800.webp', format: 'wide', aspect: '16 / 9', title: 'Снег и скорость', tag: 'Сноубординг / полный метр', story: `Вспышка 25/26 фул от @_priyateli_\nЛегендарный контест — открытие сезона\nНа @zoldol_official\nОт @skyotboardshop и @spb_shield\nСноуборд-партнёр @reverse_snowboards и WhiteOwl\nНапитки @switchbrewing и @ptichka_cbd\nДо 22.12 видео-батл по ивенту: свой профайл, чьи-то трюки, общий монтаж — всё с #вспышказолдол\n\nПушка. Монтаж @starrytsv\n\nЭто было хана!\nВсем спасибо!\nДо встречи!` },
  { id: '9457', src: '/videos/switch-tv/img_9457.mp4', poster: '/videos/switch-tv/img_9457.webp', format: 'wide', aspect: '16 / 9', title: 'Привет, мы Switch Brewing', tag: 'Знакомство / 2023', story: 'Первое короткое знакомство с Switch: банка, город и движение. Начальная точка видеоархива пивоварни.', href: 'https://t.me/switchbrewing/8' },
  { id: '9953', src: '/videos/switch-tv/img_9953.mp4', poster: '/videos/switch-tv/img_9953.webp', format: 'portrait', aspect: '9 / 16', title: 'Wasted Summer', tag: 'Заливной вайб', story: 'Пока за окном мрачно, возвращаем лето: Wasted Summer и воспоминания о «Заливной» в одном вертикальном эфире.', href: 'https://t.me/switchbrewing/11' },
  { id: '0533', src: '/videos/switch-tv/img_0533.mp4', poster: '/videos/switch-tv/img_0533.webp', format: 'portrait', aspect: '640 / 1136', title: 'Steezy IPA', tag: 'American IPA', story: 'American IPA крепостью 6,5%. Columbus, Mosaic и Idaho 7 Cryo; тот самый выпуск, который вышел только в кегах.', href: 'https://t.me/switchbrewing/14' },
];

export default function Home() {
  const [partnerSlide, setPartnerSlide] = useState(0);
  const [beerPaused, setBeerPaused] = useState(false);
  const [previewBeer, setPreviewBeer] = useState<typeof beers[number] | null>(null);
  const beerTouchUntil = useRef(0);
  const beerTouchMoved = useRef(false);
  const beerDrag = useRef<{ x: number; scroll: number } | null>(null);
  const beerRail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const formatNode = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        const parent = root.parentElement;
        if (!parent || parent.closest('script, style, code, pre, textarea')) return;
        const formatted = keepRussianShortWords(root.textContent ?? '');
        if (formatted !== root.textContent) root.textContent = formatted;
        return;
      }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script, style, code, pre, textarea')) continue;
        const formatted = keepRussianShortWords(node.textContent ?? '');
        if (formatted !== node.textContent) node.textContent = formatted;
      }
    };
    formatNode(document.body);
    const observer = new MutationObserver(records => records.forEach(record => {
      if (record.type === 'characterData') formatNode(record.target.parentNode ?? record.target);
      record.addedNodes.forEach(formatNode);
    }));
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const rail = beerRail.current;
    if (!rail || beerPaused || previewBeer) return;
    if (window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = 0;
    let position = rail.scrollLeft;
    const tick = (time: number) => {
      const elapsed = previous ? Math.min(time - previous, 50) : 0;
      previous = time;
      if (time < beerTouchUntil.current) {
        position = rail.scrollLeft;
        frame = requestAnimationFrame(tick);
        return;
      }
      const bounds = rail.getBoundingClientRect();
      if (!reduced.matches && bounds.bottom > 0 && bounds.top < window.innerHeight) {
        const width = rail.firstElementChild?.firstElementChild?.getBoundingClientRect().width || 0;
        if (width) {
          position = (position + elapsed * .035) % width;
          rail.scrollLeft = position;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [beerPaused, previewBeer]);
  useEffect(() => {
    const rail = beerRail.current;
    if (!rail) return;
    const alignFirstBeer = () => {
      if (!window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) return;
      const group = rail.querySelector<HTMLElement>('.beer-marquee-group:not([aria-hidden])');
      const first = group?.querySelector<HTMLElement>('.beer-card');
      if (!group || !first) return;
      group.style.paddingLeft = `${Math.max(0, (rail.clientWidth - first.offsetWidth) / 2)}px`;
      rail.scrollLeft = 0;
    };
    alignFirstBeer();
    window.addEventListener('resize', alignFirstBeer);
    return () => window.removeEventListener('resize', alignFirstBeer);
  }, []);
  function stepBeer(direction: number) {
    setPreviewBeer(null);
    setBeerPaused(false);
    beerTouchUntil.current = performance.now() + 1600;
    const rail = beerRail.current;
    if (!rail) return;
    const center = rail.getBoundingClientRect().left + rail.clientWidth / 2;
    const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>(mobile ? '.beer-marquee-group:not([aria-hidden]) .beer-card' : '.beer-card'));
    if (mobile) {
      const current = cards.reduce((best, card, index) => {
        const bounds = card.getBoundingClientRect();
        const distance = Math.abs(bounds.left + bounds.width / 2 - center);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Infinity }).index;
      const target = cards[(current + direction + cards.length) % cards.length];
      const bounds = target.getBoundingClientRect();
      rail.scrollTo({ left: rail.scrollLeft + bounds.left + bounds.width / 2 - center, behavior: 'smooth' });
      return;
    }
    const offsets = cards.map(card => {
      const bounds = card.getBoundingClientRect();
      return bounds.left + bounds.width / 2 - center;
    });
    let offset = direction > 0
      ? offsets.find(value => value > 2)
      : offsets.findLast(value => value < -2);
    if (offset === undefined) return;
    let target = rail.scrollLeft + offset;
    const loopWidth = rail.querySelector('.beer-marquee-group')?.getBoundingClientRect().width || 0;
    if (target < 0 && loopWidth) {
      rail.scrollLeft += loopWidth;
      target += loopWidth;
    }
    rail.scrollTo({ left: target, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  const [brewPage, setBrewPage] = useState(0);
  const brewGalleryRef = useRef<HTMLDivElement>(null);
  const merchGalleryRef = useRef<HTMLDivElement>(null);
  const [merchPage, setMerchPage] = useState(0);
  const [switchTvIndex, setSwitchTvIndex] = useState(0);
  const [watermarkVisible, setWatermarkVisible] = useState(false);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const switchTvReelRef = useRef<HTMLDivElement>(null);
  const selectedSwitchTv = switchTvVideos[switchTvIndex];
  const selectSwitchTv = (index: number) => {
    const reel = switchTvReelRef.current?.querySelector<HTMLElement>('.switch-tv-reel-track');
    const next = (index + switchTvVideos.length) % switchTvVideos.length;
    reel?.scrollTo({ left: next * reel.clientWidth, behavior: 'smooth' });
  };
  const navigateToSection = (event: ReactMouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    link.closest('details')?.removeAttribute('open');
    window.history.pushState(null, '', link.hash);
    window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  useEffect(() => {
    const reel = switchTvReelRef.current;
    if (!reel) return;
    reel.querySelectorAll<HTMLVideoElement>('video').forEach((video, index) => {
      if (index === switchTvIndex) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [switchTvIndex]);

  useEffect(() => {
    const heroLogo = heroLogoRef.current;
    if (!heroLogo) return;
    let lastScrollY = window.scrollY;
    let frame = 0;

    const updateWatermark = (initial = false) => {
      const currentScrollY = window.scrollY;
      const logoBottom = heroLogo.getBoundingClientRect().bottom;

      if (initial) {
        setWatermarkVisible(logoBottom < 40);
      } else if (currentScrollY > lastScrollY && logoBottom <= 280) {
        setWatermarkVisible(true);
      } else if (currentScrollY < lastScrollY && logoBottom >= 40) {
        setWatermarkVisible(false);
      }

      lastScrollY = currentScrollY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(() => updateWatermark());
    };
    const onResize = () => updateWatermark(true);

    updateWatermark(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.switch-tv-machine[data-scroll-reveal]'));
    if (!revealItems.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('has-scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -9% 0px' });

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.9) item.classList.add('is-revealed');
      else observer.observe(item);
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('has-scroll-reveal');
    };
  }, []);

  return <main onClick={navigateToSection}>
    <div className={`global-ricar-watermark${watermarkVisible ? ' is-visible' : ''}`} aria-hidden="true">
      <img className="ricar-ink" src="/optimized/ricar-ink.webp" alt="" decoding="async"/>
      <img className="ricar-color" src="/optimized/ricar-color.webp" alt="" decoding="async"/>
    </div>
    <div className="peacock-rail" aria-hidden="true">
      <svg className="peacock-top" viewBox="0 0 521 800" focusable="false">
        <defs><filter id="rail-white-ink" colorInterpolationFilters="sRGB"><feFlood floodColor="white"/><feComposite in2="SourceAlpha" operator="in"/></filter><clipPath id="peacock-angel-contour"><rect x="0" y="0" width="700" height="680"/></clipPath></defs>
        <image href="/peacock-angel-top-transparent.png" x="82.318" width="521" height="760" clipPath="url(#peacock-angel-contour)"/>
        <path d="M166.3 680 C162 713 158 750 158 801 L166 801 C166 750 168 714 172.3 680 Z M200.3 680 C204 720 196.8 760 196.8 801 L202.8 801 C202.8 760 211 720 207.3 680 Z"/>
        <path d="M175.8 680 C175 725 172.6 770 172.6 801 L177.5 801 C177.5 770 180.6 725 181.4 680 Z M188.6 680 C190 705 187 729 187 743 C185 726 185 704 194.1 680 Z"/>
      </svg>
      <div className="peacock-stream"/>
      <svg className="peacock-bottom" viewBox="0 0 300 255" focusable="false">
        <defs><clipPath id="peacock-skull-contour"><rect x="0" y="150" width="300" height="105"/></clipPath></defs>
        <image href="/optimized/peacock-bottom.webp" width="300" height="255" clipPath="url(#peacock-skull-contour)"/>
        <path d="M92 -1 C92 55 82.5 110 84.5 150 L87 150 C85 110 96.2 55 96.2 -1 Z M115.2 -1 C115.2 55 114 108 118.5 150 L121 150 C116.5 108 119.4 55 119.4 -1 Z"/>
        <path d="M109 111 C110 124 110 138 111 150 L113 150 C112 137 112 123 110 111 Z"/>
      </svg>
    </div>
    <header className="header">
      <span className="mini-logo" aria-hidden="true"/>
      <details className="site-menu">
        <summary aria-label="Меню сайта"><span/><span/><span/></summary>
        <div className="site-menu-panel">
          <nav aria-label="Основное меню">
            <a href="#switch-tv">Switch TV</a>
            <a href="#history">История</a>
            <a href="#stock">Пиво</a>
            <a href="#process">Процесс</a>
            <a href="#festivals">Фестивали</a>
            <a href="#merch">Мерч</a>
            <a href="#partners">Наши партнёры</a>
            <a href="#new">Лента</a>
            <a href="#contacts">Контакты</a>
          </nav>
        </div>
      </details>
    </header>

    <section className="home" id="top">
      <div className="hero-logo" ref={heroLogoRef}><img src="/switch-hero-transparent.png" alt="Switch Brewing — птица с хмелем" fetchPriority="high"/></div>
      <p className="hero-statement">Switch Brewing — пиво из Петербурга. Любим громкую музыку, поддерживаем скейтбординг и сноубординг.</p>
    </section>

    <section className="switch-tv" id="switch-tv" aria-labelledby="switch-tv-title">
      <div className="switch-tv-machine switch-tv-machine--vertical switch-tv-machine--vintage" data-scroll-reveal="right" ref={switchTvReelRef}>
        <div className="switch-tv-machine-head"><h2 className="switch-tv-wordmark" id="switch-tv-title"><img src="/switch-tv-wordmark-crop.png" alt="Switch TV"/></h2></div>
        <div className="switch-tv-reel-shell">
          <div className="switch-tv-reel-window" aria-live="polite">
            <div className="switch-tv-reel-track" tabIndex={0} aria-label="Видео Switch TV — листайте вбок" onScroll={(event) => {
              const reel = event.currentTarget;
              setSwitchTvIndex(Math.round(reel.scrollLeft / reel.clientWidth));
            }}>
              {switchTvVideos.map((video, index) => <article className={`switch-tv-reel-slide switch-tv-program--${video.format}`} aria-hidden={index !== switchTvIndex} key={video.id}>
                <div className="switch-tv-player" style={{ aspectRatio: video.aspect }}>
                  <video controls playsInline muted autoPlay={index === switchTvIndex} preload={index === switchTvIndex ? 'metadata' : 'none'} poster={`${video.poster}?v=${switchTvAssetVersion}`} tabIndex={index === switchTvIndex ? 0 : -1}>
                    <source src={`${video.src.replace('/videos/switch-tv/', '/api/video/')}?v=${switchTvAssetVersion}`} type="video/mp4"/>
                  </video>
                </div>
                <div className="switch-tv-story">
                  <h3>{video.title === 'Стратакостер' ? 'Страта\u00adкостер' : video.title}</h3>
                  <p className="switch-tv-summary-desktop">{tvSummaries[video.id]}</p>
                  <p className="switch-tv-summary-mobile">{tvMobileSummaries[video.id]}</p>
                </div>
              </article>)}
            </div>
          </div>
          <div className="switch-tv-reel-controls" aria-label="Перелистывание Switch TV">
            <MorphButton className="switch-tv-arrow" type="button" from={ChevronLeft} to={ArrowLeft} iconSize={28} onClick={() => selectSwitchTv(switchTvIndex - 1)} aria-label="Предыдущее видео"/>
            <MorphButton className="switch-tv-arrow" type="button" from={ChevronRight} to={ArrowRight} iconSize={28} onClick={() => selectSwitchTv(switchTvIndex + 1)} aria-label="Следующее видео"/>
          </div>
        </div>
        <div className="switch-tv-reel-dots" aria-label={`Выбран эфир ${selectedSwitchTv.title}`}>{switchTvVideos.map((video, index) => <span className={index === switchTvIndex ? 'is-selected' : ''} aria-hidden="true" key={video.id}/>)}</div>
      </div>
    </section>

    <section className="history" id="history">
      <div className="chapter-cover history-cover" data-scroll-reveal="right">
        <img src="/switch-photos/history-founders.jpg" alt="Команда Switch Brewing в пивоваренном цехе" loading="lazy" decoding="async"/>
        <div className="chapter-cover__title"><h2>ИСТОРИЯ</h2></div>
      </div>
      <div className="history-editorial">
        <div className="history-copy history-copy--lead" data-scroll-reveal="right">
          <p className="big">Пиво, доски, музыка погромче.</p>
          <p className="history-lead-copy">
            <span className="mobile-copy-sentence">Любим Петербург, его споты и&nbsp;бары.</span>
            <span className="history-seasons"><span>Летом — скейт,</span> <span>зимой — сноуборд.</span></span>
            <span className="mobile-copy-sentence">Всё это попадает в&nbsp;наши сорта: в&nbsp;названия, этикетки и&nbsp;совместные варки.</span>
          </p>
        </div>
        <div className="history-words history-words--upper" data-scroll-reveal="bottom"><span>Петербургские споты</span></div>
        <figure className="history-photo history-photo--taps" data-scroll-reveal="bottom"><img src="/switch-photos/history-taps.jpg" alt="Фирменные рукоятки кранов Switch Brewing" loading="lazy" decoding="async"/><figcaption>Своя интонация</figcaption></figure>
        <figure className="history-photo history-photo--spot" data-scroll-reveal="bottom"><img src="/switch-photos/history-skate-thanks.webp" alt="Банка Switch Brewing с биркой Спасибо скейтбординг" loading="lazy" decoding="async"/><figcaption>Спасибо, скейтбординг</figcaption></figure>
        <div className="history-skate-gallery" data-scroll-reveal="bottom" aria-label="Скейтбординг и Switch Brewing">
          <figure><img src="/switch-photos/history-skate-beer.webp" alt="Банка пива Switch Brewing рядом со скейтбордом" loading="lazy" decoding="async"/><figcaption>Пиво и доска</figcaption></figure>
          <figure><img src="/switch-photos/history-snowboard.webp" alt="Switch Brewing на сноубордическом склоне" loading="lazy" decoding="async"/><figcaption>Switch на склоне</figcaption></figure>
        </div>
        <div className="history-words history-words--festival" data-scroll-reveal="bottom"><span>Фестивали и события</span></div>
        <div className="history-photo--festival history-festival-block" id="festivals" data-scroll-reveal="left">
          <figure className="history-photo"><img src="/switch-photos/history-festival.jpg" alt="Команда Switch Brewing на фестивале" loading="lazy" decoding="async"/><figcaption>Фестивали и люди рядом</figcaption></figure>
          <a className="hero-order-button festival-invite-button" href="mailto:switchbrewery@gmail.com"><strong>ПРИГЛАСИТЬ НА ФЕСТИВАЛЬ</strong></a>
        </div>
        <div className="history-copy history-copy--continuation" data-scroll-reveal="right"><p><span className="mobile-copy-sentence">Варим вместе с другими пивоварнями, барами и скейтшопами.</span> <span className="mobile-copy-sentence">Пробуем новый хмель, спорим о рецептах, везём пиво на фестивали.</span> <span className="mobile-copy-sentence">Увидимся у крана — подходите знакомиться.</span></p><div className="history-years"><div><strong>2018</strong><span>старт производства</span></div><div><strong>41</strong><span>сорт в истории</span></div></div></div>
        <figure className="history-photo history-photo--logistics" data-scroll-reveal="left"><img src="/switch-photos/history-logistics.jpg" alt="Пивовар Switch Brewing рядом с готовыми коробками" loading="lazy" decoding="async"/><figcaption>От варки до отгрузки</figcaption></figure>
      </div>
      <a className="history-untappd" href="https://untappd.com/SwitchBrewing/beer" target="_blank" rel="noreferrer"><strong>Switch Brewing на Untappd</strong><span>Наши сорта и отзывы — посмотреть на Untappd</span></a>
    </section>

    <section className={`stock${previewBeer ? ' has-beer-preview' : ''}`} id="stock">
      <div className="section-title" data-scroll-reveal="right"><div className="stock-heading"><h2>ПИВО</h2><p><span className="mobile-copy-sentence">Сорта Switch Brewing: истории, стили и состав.</span> <span className="mobile-copy-sentence">По вопросам пива свяжитесь с нами через раздел «Контакты».</span></p></div></div>
      <div className="beer-shelf" onKeyDown={event => { if (event.key === 'Escape') setPreviewBeer(null); }}>
      <div className="beer-mobile-navigation"><MorphButton type="button" from={ChevronLeft} to={ChevronLeft} iconSize={24} aria-label="Предыдущее пиво" onClick={() => stepBeer(-1)}/><MorphButton type="button" from={ChevronRight} to={ChevronRight} iconSize={24} aria-label="Следующее пиво" onClick={() => stepBeer(1)}/></div>
      <div ref={beerRail}
        onPointerDown={event => {
          if (event.pointerType !== 'mouse' || event.button !== 0) return;
          beerDrag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft };
          beerTouchUntil.current = Infinity;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const drag = beerDrag.current;
          if (!drag) return;
          if (Math.abs(event.clientX - drag.x) > 5) setPreviewBeer(null);
          event.currentTarget.scrollLeft = drag.scroll + drag.x - event.clientX;
        }}
        onPointerUp={() => { if (beerDrag.current) { beerDrag.current = null; beerTouchUntil.current = performance.now() + 1600; } }}
        onLostPointerCapture={() => { beerDrag.current = null; beerTouchUntil.current = performance.now() + 1600; }}
        onPointerCancel={() => { beerDrag.current = null; beerTouchUntil.current = performance.now() + 1600; }}
        onWheel={() => { setPreviewBeer(null); beerTouchUntil.current = performance.now() + 1600; }}
        onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); stepBeer(event.key === 'ArrowLeft' ? -1 : 1); } }}
        onTouchStart={() => { beerTouchMoved.current = false; beerTouchUntil.current = Infinity; }} onTouchMove={() => { beerTouchMoved.current = true; }} onTouchEnd={() => { beerTouchUntil.current = performance.now() + 1200; }} onTouchCancel={() => { beerTouchUntil.current = performance.now() + 1200; }} className={`beer-marquee${beerPaused || previewBeer ? ' is-paused' : ''}`} tabIndex={0} role="region" aria-label="Сорта пива — горизонтальная лента">
      <div className="beer-marquee-track">{[0, 1].map(copy => <div className="stock-list beer-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{orderedBeers.map((beer, index) => {
        return <article className={`beer-card beer-card--${beer.id}${previewBeer?.id === beer.id ? ' is-expanded' : ''}`} key={beer.id} tabIndex={copy === 0 ? 0 : -1}
          onClick={event => { if (window.matchMedia('(max-width: 767px), (pointer: coarse)').matches && !beerTouchMoved.current) { setBeerPaused(false); setPreviewBeer(previewBeer?.id === beer.id ? null : beer); if (previewBeer?.id !== beer.id) { const rail = beerRail.current; if (rail) rail.scrollBy({ left: event.currentTarget.getBoundingClientRect().left - rail.getBoundingClientRect().left - (rail.clientWidth - event.currentTarget.clientWidth) / 2, behavior: 'smooth' }); } } }}
          onMouseEnter={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setPreviewBeer(beer); }} onMouseLeave={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setPreviewBeer(null); }}
          onFocus={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setPreviewBeer(beer); }} onBlur={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setPreviewBeer(null); }}>
        <div className="beer-photo">
          <img src={beer.image} alt={beer.imageAlt} loading="lazy" decoding="async" draggable={false}/>
        </div>
        <div className="beer-card-body">
          <div className="beer-name"><h3>{beer.name}</h3><span>{beer.style}</span></div>
          <div className="beer-details"><p className="beer-description">{beer.description}</p>
          <dl className="beer-meta"><div><dt>Крепость</dt><dd>{beer.abv === '—' ? 'Не указана' : beer.abv}</dd></div><div><dt>{beer.id === 'paid' ? 'Коллаборация' : beer.id === 'handrails' ? 'Плотность / IBU' : 'Хмель'}</dt><dd>{beer.hops}</dd></div>{beer.format && <div><dt>Объём</dt><dd>{beer.format}</dd></div>}</dl>
          </div>
        </div>
      </article>})}</div>)}</div></div>
      {previewBeer && <aside className={`beer-spotlight beer-card--${previewBeer.id}`} key={previewBeer.id} aria-label={previewBeer.name}>
        <div className="beer-photo"><img src={previewBeer.image} alt={previewBeer.imageAlt}/></div>
        <div className="beer-spotlight-copy"><h3>{previewBeer.name}</h3><span>{previewBeer.style}</span>
        <p><strong>{previewBeer.description.split('. ')[0]}{previewBeer.description.includes('. ') ? '.' : ''}</strong>{previewBeer.description.includes('. ') ? previewBeer.description.split('. ').slice(1).join('. ') : ''}</p>
        <dl className="beer-spotlight-specs">
          <div><dt>Стиль</dt><dd>{previewBeer.style}</dd></div>
          <div><dt>Крепость</dt><dd>{previewBeer.abv === '—' ? 'Не указана' : previewBeer.abv}</dd></div>
          <div><dt>{previewBeer.id === 'paid' ? 'Коллаборация' : previewBeer.id === 'handrails' ? 'Плотность / IBU' : 'Хмель'}</dt><dd>{previewBeer.hops}</dd></div>
          {previewBeer.format && <div><dt>Объём</dt><dd>{previewBeer.format}</dd></div>}
        </dl></div>
      </aside>}
      </div>
      <div className="stock-note"><b>18+</b> Сведения справочные и не являются публичной офертой. Розничная дистанционная продажа алкогольной продукции не осуществляется. Фактическое приобретение возможно только законным способом с проверкой возраста продавцом.</div>
    </section>

    <section className="brewery" id="process">
      <div className="brewery-frame" data-scroll-reveal="left">
        <div className="brewery-visual"><img src="/brewery-new/brew-07.jpg" alt="Большие танки и трубы пивоваренного производства" loading="lazy" decoding="async"/><div className="brewery-overlay"><h2>ПРОЦЕСС</h2></div></div>
      </div>
      <div className="brewery-zine">
        <h3 className="brewery-zine-title"><span>ВАРИМ</span><span>САМИ</span></h3>
        <div className="process-copy" data-scroll-reveal="right"><p className="process-copy-text"><span>Каждая варка начинается с&nbsp;идеи, а&nbsp;дальше — металл, пар, хмель, дрожжи и&nbsp;много внимания.</span><span>Никакой магии: только характер и&nbsp;точная работа.</span></p><img className="process-detail-photo" src="/switch-photos/brew-detail-02.jpg" alt="Выгрузка солодовой дробины из варочного оборудования" loading="lazy" decoding="async"/></div>
        <figure className="brew-shot brew-shot--tanks"><img src="/switch-photos/brew-aisle.jpg" alt="Ряд варочных танков Switch Brewing" loading="lazy" decoding="async"/><figcaption>02 / Варка — огонь, хмель, точность</figcaption></figure>
        <figure className="brew-shot brew-shot--sample"><img src="/switch-photos/brew-filling.jpg" alt="Розлив пива в пивоваренном цехе" loading="lazy" decoding="async"/><figcaption>03 / Брожение — даём пиву время</figcaption></figure>
        <figure className="brew-shot brew-shot--floor"><img src="/switch-photos/brew-vat.jpg" alt="Детали варочного оборудования" loading="lazy" decoding="async"/><figcaption>Цех / баки / трубы / рабочий беспорядок</figcaption></figure>
        <div className="process-stamp">СВАРЕНО<br/>В ПЕТЕРБУРГЕ</div>
      </div>
      <div className="photo-carousel">
      <div className="brew-gallery brew-gallery--pages" ref={brewGalleryRef} onScroll={(event) => {
        const gallery = event.currentTarget;
        setBrewPage(Math.round(gallery.scrollLeft / (gallery.clientWidth + 16)));
        }} data-scroll-reveal="bottom" aria-label="Варка и готовое пиво — листайте фотографии вбок" tabIndex={0}>
        <div className="brew-photo-page">
        <figure><img src="/switch-photos/brew-detail-01.jpg" alt="Хмель и бокал Switch Brewing" loading="lazy" decoding="async"/><figcaption>Хмель</figcaption></figure>
        <figure><img src="/switch-photos/bottles.jpg" alt="Бутылки Switch Brewing после розлива" loading="lazy" decoding="async"/><figcaption>Розлив</figcaption></figure>
        <figure><img src="/switch-photos/brew-extra-01.jpg" alt="Два сорта пива Switch Brewing" loading="lazy" decoding="async"/><figcaption>Два характера</figcaption></figure>
        </div>
        <div className="brew-photo-page">
        <figure><img src="/switch-photos/brew-extra-02.jpg" alt="Золотое пиво в фирменном бокале" loading="lazy" decoding="async"/><figcaption>Готово</figcaption></figure>
        <figure><img src="/switch-photos/brew-extra-03.jpg" alt="Светлое пиво в бокале с рыцарем" loading="lazy" decoding="async"/><figcaption>Свежая варка</figcaption></figure>
        <figure className="brew-gallery__brewer"><img src="/switch-photos/process-brewer-portrait.webp" alt="Пивовар Switch Brewing рядом с баллонами для розлива" loading="lazy" decoding="async"/><figcaption>Контроль / проба / розлив</figcaption></figure>
        </div>
      </div>
      <div className="brew-page-controls">
        <MorphButton type="button" from={ChevronLeft} to={ChevronLeft} iconSize={20} aria-label="Предыдущая страница фотографий" onClick={() => {
          const gallery = brewGalleryRef.current;
          if (gallery) gallery.scrollTo({ left: gallery.scrollLeft <= 2 ? gallery.scrollWidth - gallery.clientWidth : Math.max(0, (brewPage - 1) * (gallery.clientWidth + 16)), behavior: 'smooth' });
        }}/>
        <span className="gallery-progress" aria-live="polite">{brewPage + 1}<span aria-hidden="true"> / </span><span className="gallery-total-desktop">2</span><span className="gallery-total-mobile">6</span></span>
        <MorphButton type="button" from={ChevronRight} to={ChevronRight} iconSize={20} aria-label="Следующая страница фотографий" onClick={() => {
          const gallery = brewGalleryRef.current;
          if (gallery) gallery.scrollTo({ left: gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 2 ? 0 : (brewPage + 1) * (gallery.clientWidth + 16), behavior: 'smooth' });
        }}/>
      </div>
      </div>
    </section>

    <section className="merch" id="merch">
      <div className="chapter-cover merch-cover" data-scroll-reveal="right">
        <img src="/switch-photos/merch-white-bar.webp" alt="Бармен держит белую футболку Switch Brewing" loading="lazy" decoding="async"/>
        <div className="chapter-cover__title"><h2>МЕРЧ</h2></div>
      </div>
      <div className="photo-carousel">
      <div className="merch-gallery merch-gallery--pages" ref={merchGalleryRef} onScroll={(event) => {
        const gallery = event.currentTarget;
        setMerchPage(Math.round(gallery.scrollLeft / (gallery.clientWidth + 16)));
        }} data-scroll-reveal="bottom" aria-label="Мерч Switch Brewing — листайте фотографии вбок" tabIndex={0}>
        <div className="brew-photo-page">
        <figure><img src="/switch-photos/merch-black-long.webp" alt="Чёрный лонгслив Switch Brewing" loading="lazy" decoding="async"/><figcaption>Лонгслив / чёрный</figcaption></figure>
        <figure><img src="/switch-photos/merch-black-angel.webp" alt="Чёрная футболка Switch Brewing с фирменным рисунком" loading="lazy" decoding="async"/><figcaption>Футболка / ангел и рыцарь</figcaption></figure>
        <figure><img src="/switch-photos/merch-white-long.webp" alt="Белый лонгслив Switch Brewing с рисунком на рукаве" loading="lazy" decoding="async"/><figcaption>Лонгслив / белый</figcaption></figure>
        </div>
        <div className="brew-photo-page">
        <figure><img src="/switch-photos/merch-print-detail.webp" alt="Крупный план принта Switch Brewing" loading="lazy" decoding="async"/><figcaption>Принт / крупный план</figcaption></figure>
        <figure><img src="/switch-photos/merch-white-shirts.webp" alt="Белые футболки Switch Brewing спереди и сзади" loading="lazy" decoding="async"/><figcaption>Футболка / белая</figcaption></figure>
        <figure><img src="/switch-photos/merch-two-shirts.webp" alt="Две чёрные футболки Switch Brewing с разными принтами" loading="lazy" decoding="async"/><figcaption>Футболки / два принта</figcaption></figure>
        </div>
      </div>
      <div className="brew-page-controls">
        <MorphButton type="button" from={ChevronLeft} to={ChevronLeft} iconSize={20} aria-label="Предыдущая страница мерча" onClick={() => {
          const gallery = merchGalleryRef.current;
          if (gallery) gallery.scrollTo({ left: gallery.scrollLeft <= 2 ? gallery.scrollWidth - gallery.clientWidth : Math.max(0, (merchPage - 1) * (gallery.clientWidth + 16)), behavior: 'smooth' });
        }}/>
        <span className="gallery-progress" aria-live="polite">{merchPage + 1}<span aria-hidden="true"> / </span><span className="gallery-total-desktop">2</span><span className="gallery-total-mobile">6</span></span>
        <MorphButton type="button" from={ChevronRight} to={ChevronRight} iconSize={20} aria-label="Следующая страница мерча" onClick={() => {
          const gallery = merchGalleryRef.current;
          if (gallery) gallery.scrollTo({ left: gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 2 ? 0 : (merchPage + 1) * (gallery.clientWidth + 16), behavior: 'smooth' });
        }}/>
      </div>
      </div>
    </section>

    <section className="partners" id="partners">
      <div className="partner-marquee" aria-hidden="true"><div>{Array.from({ length: 9 }, (_, index) => <span key={index}>Наши партнёры<img src="/optimized/switch-mark.webp" alt="" loading="lazy" decoding="async"/></span>)}</div></div>
      <div className="partner-carousel" aria-label="Наши партнёры" data-scroll-reveal="right">
        <MorphButton className="partner-arrow partner-prev" type="button" from={ChevronLeft} to={ArrowLeft} iconSize={29} onClick={() => setPartnerSlide((partnerSlide - 1 + partnerSlides.length) % partnerSlides.length)} aria-label="Предыдущие партнёры"/>
        <div className="partner-viewport">
          <div className="partner-track" style={{ transform: `translateX(-${partnerSlide * 100}%)` }}>
            {partnerSlides.map((slide, slideIndex) => <div className="partner-slide" key={slideIndex}>{slide.map((partner) => partner.href ? <a className="partner-logo" href={partner.href} target="_blank" rel="noreferrer" key={partner.name} aria-label={partner.name}><img src={partner.image} alt={partner.name} loading="lazy" decoding="async"/></a> : <div className="partner-logo" key={partner.name}><img src={partner.image} alt={partner.name} loading="lazy" decoding="async"/></div>)}</div>)}
          </div>
        </div>
        <MorphButton className="partner-arrow partner-next" type="button" from={ChevronRight} to={ArrowRight} iconSize={29} onClick={() => setPartnerSlide((partnerSlide + 1) % partnerSlides.length)} aria-label="Следующие партнёры"/>
      </div>
      <div className="partner-dots" aria-label="Страницы партнёров">{partnerSlides.map((_, index) => <button type="button" className={index === partnerSlide ? 'active' : ''} onClick={() => setPartnerSlide(index)} aria-label={`Перейти к группе ${index + 1}`} aria-current={index === partnerSlide ? 'true' : undefined} key={index}/>)}</div>
    </section>

    <section className="editorial" id="new">
      <div className="editorial-head" data-scroll-reveal="left">
        <div className="section-title"><h2>ЛЕНТА</h2></div>
        <p>Фестивали, коллаборации, скейтбординг и люди, которые двигают Switch вперёд.</p>
        <div className="editorial-beats" aria-label="Темы ленты"><span>Релизы</span><span>Фестивали</span><span>Коллаборации</span></div>
      </div>
      <div className="latest-feed" data-scroll-reveal="bottom">
        {editorialStories.map(item => <article key={item.title}>
          <NewsGallery title={item.title} images={item.title === 'Лето отгремело' ? [4, 2, 3, 1, ...Array.from({ length: 16 }, (_, i) => i + 5)].map(i => `/news/festival-${i}.jpg`) : item.title === 'Площадь Искусств × TREPANG' ? Array.from({ length: 4 }, (_, i) => `/news/trepang-${i + 1}.jpg`) : item.title === 'Пять кранов в RULE' ? ['/news/rule-taproom.jpg'] : [item.image]}/>
          <div className="latest-feed-meta"><time>{item.date}</time><span>{item.category}</span></div>
          <p>{item.text}</p>
        </article>)}
      </div>
    </section>

    <section className="switch-outro" id="contacts" aria-labelledby="contacts-title">
      <div className="switch-outro-columns">
        <div className="switch-outro-contacts">
          <h2 id="contacts-title">Контакты</h2>
          <p>По вопросам пива.</p>
          <div className="contact-links">
            <svg className="social-direction contact-direction" viewBox="0 0 110 60" aria-hidden="true"><path d="M8 12L63 7 51 25 91 43M77 44l16 1-4-16"/><path className="direction-accent" d="M11 22l23-2"/></svg>
            <a href="mailto:switchbrewery@gmail.com">switchbrewery@gmail.com</a>
            <a href="tel:+79531432103">+7 953 143-21-03</a>
          </div>
        </div>
        <div className="switch-outro-social">
          <h2>Куда дальше?</h2>
          <p>На связи со Switch</p>
          <nav aria-label="Switch Brewing в соцсетях">
            <svg className="social-direction social-direction--fork" viewBox="0 0 44 200" preserveAspectRatio="none" aria-hidden="true"><path vectorEffect="non-scaling-stroke" d="M12 4C35 14 40 37 26 47Q17 53 5 50M25 48C10 68 9 98 25 106C43 115 43 87 28 88C12 89 16 116 29 128Q43 151 5 150M13 42l-9 8 10 6M14 142l-10 8 10 7"/><path className="direction-accent" vectorEffect="non-scaling-stroke" d="M34 7l5-4M39 16l4 1"/></svg>
            <a href="https://t.me/switchbrewing" target="_blank" rel="noreferrer">Telegram</a>
            <a href="https://www.instagram.com/switchbrewing/" target="_blank" rel="noreferrer" aria-describedby="instagram-note">Instagram*</a>
          </nav>
        </div>
      </div>
      <p className="switch-outro-note" id="instagram-note">* Instagram принадлежит Meta Platforms Inc., признанной экстремистской организацией; её деятельность запрещена в Российской Федерации.</p>
    </section>

    <LegalCompliance />

    <div className="responsible-bar" role="note"><b>18+</b><span>Чрезмерное употребление алкоголя вредит вашему здоровью.</span></div>

  </main>;
}
