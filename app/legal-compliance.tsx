'use client';

import { useEffect, useState } from 'react';
import { Cookie, FileSignature, ShieldCheck, UserRound } from 'lucide';
import { MorphIcon } from 'morphicons/react';

type LegalDocument = 'privacy' | 'cookies' | 'consent' | 'alcohol' | null;

const titles: Record<Exclude<LegalDocument, null>, string> = {
  privacy: 'Информация о данных посетителей',
  cookies: 'Уведомление об использовании cookies и localStorage',
  consent: 'Информация об обработке обращений',
  alcohol: 'Правила использования сайта и информация об алкоголе',
};

export function LegalCompliance() {
  const [ageAccepted, setAgeAccepted] = useState(false);
  const [activeDocument, setActiveDocument] = useState<LegalDocument>(null);

  useEffect(() => {
    const locked = !ageAccepted || activeDocument !== null;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [ageAccepted, activeDocument]);

  const confirmAge = () => {
    setAgeAccepted(true);
  };

  const leaveSite = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.assign('https://yandex.ru/');
  };

  return <>
    {!ageAccepted && <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate-card">
        <div className="age-gate-mark">18+</div>
        <div className="age-gate-copy">
          <span>Switch Brewing / Санкт-Петербург</span>
          <h1 id="age-gate-title">ТОЛЬКО ДЛЯ СОВЕРШЕННОЛЕТНИХ</h1>
          <p>Сайт содержит информацию об алкогольной продукции. Подтвердите, что вам исполнилось 18 лет.</p>
          <strong>Чрезмерное употребление алкоголя вредит вашему здоровью.</strong>
          <small>Сайт носит информационный характер. Розничная дистанционная продажа алкогольной продукции не осуществляется.</small>
        </div>
        <div className="age-gate-actions">
          <button type="button" onClick={confirmAge}>Да, мне исполнилось 18 лет →</button>
          <button type="button" onClick={leaveSite}>Нет, мне нет 18 лет / покинуть сайт</button>
        </div>
      </div>
    </div>}

    <section className="legal-summary" id="legal" aria-labelledby="legal-title">
      <div className="legal-mark">
        <div className="legal-age"><small>Только для</small><h2 id="legal-title">18+</h2><strong>совершеннолетних</strong></div>
      </div>
      <div className="legal-summary-copy">
        <p>Здесь представлена информация о Switch Brewing, деятельности пивоварни и ассортименте. Контакты предназначены для информационных вопросов и делового сотрудничества. На сайте нет оформления розничных заказов, оплаты или заказа доставки алкогольной продукции.</p>
      </div>
        <div className="legal-links">
          <button type="button" onClick={() => setActiveDocument('alcohol')}><span className="legal-link-icon" aria-hidden="true"><MorphIcon icon={ShieldCheck} size={25} strokeWidth={1.6} reducedMotion="user" /></span><b>Алкоголь и правила сайта</b><small>Читать</small></button>
          <button type="button" onClick={() => setActiveDocument('privacy')}><span className="legal-link-icon" aria-hidden="true"><MorphIcon icon={UserRound} size={25} strokeWidth={1.6} reducedMotion="user" /></span><b>Персональные данные</b><small>Читать</small></button>
          <button type="button" onClick={() => setActiveDocument('consent')}><span className="legal-link-icon" aria-hidden="true"><MorphIcon icon={FileSignature} size={25} strokeWidth={1.6} reducedMotion="user" /></span><b>Обработка обращений</b><small>Читать</small></button>
          <button type="button" onClick={() => setActiveDocument('cookies')}><span className="legal-link-icon" aria-hidden="true"><MorphIcon icon={Cookie} size={25} strokeWidth={1.6} reducedMotion="user" /></span><b>Cookies и localStorage</b><small>Читать</small></button>
        </div>
    </section>

    {activeDocument && <div className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveDocument(null); }}>
      <article>
        <button className="legal-close" type="button" onClick={() => setActiveDocument(null)} aria-label="Закрыть">×</button>
        <span>Switch Brewing / правовая информация</span>
        <h2 id="legal-modal-title">{titles[activeDocument]}</h2>
        {activeDocument === 'alcohol' && <div className="legal-text">
          <h3>1. Назначение сайта</h3><p>Сайт предназначен исключительно для информирования совершеннолетних посетителей о деятельности пивоварни, производственном процессе, ассортименте и возможных форматах сотрудничества. Информация на сайте не является публичной офертой.</p>
          <h3>2. Продажа алкогольной продукции</h3><p>На сайте нет оформления розничных заказов, оплаты или заказа доставки алкогольной продукции. Контакты предназначены для информационных вопросов и делового сотрудничества, а не для дистанционного оформления розничной покупки алкоголя.</p>
          <h3>3. Возраст</h3><p>Материалы предназначены для лиц, достигших 18 лет. Экран 18+ не заменяет проверку возраста продавцом при законной реализации продукции.</p>
          <h3>4. Предупреждение</h3><p><b>Чрезмерное употребление алкоголя вредит вашему здоровью.</b> Не рекомендуется употреблять алкоголь лицам младше 18 лет, беременным и кормящим женщинам, а также лицам с заболеваниями нервной системы и внутренних органов.</p>
          <h3>5. Контакты и внешние ресурсы</h3><p>Переходы в Telegram, Untappd и на сайты партнёров ведут на внешние ресурсы, правила которых определяются их владельцами.</p>
        </div>}
        {activeDocument === 'privacy' && <div className="legal-text">
          <p>Этот раздел описывает технические функции сайта и не заменяет политику оператора персональных данных. Сведения о юридическом лице или ИП — операторе, фактических сроках хранения и получателях данных требуют уточнения владельцем сайта.</p>
          <h3>1. Функции сайта</h3><p>В прикладном коде нет форм отправки обращений, регистрации, оплаты, рекламных или аналитических счётчиков. Сам сайт не сохраняет cookies или настройки в localStorage.</p>
          <h3>2. Хостинг и внешние сервисы</h3><p>При загрузке страницы запросы поступают инфраструктуре размещения сайта. Состав технических журналов, место и сроки их хранения этим разделом не подтверждаются. Ссылки на почту и внешние ресурсы открывают отдельные сервисы; отправленные там сведения обрабатываются вне прикладного кода сайта.</p>
          <h3>3. Вопросы об обработке</h3><p>Для уточнения сведений об операторе и обработки обращения используйте контакт <a href="mailto:switchbrewery@gmail.com">switchbrewery@gmail.com</a>. Не отправляйте паспортные данные, платёжные реквизиты, сведения о здоровье и данные третьих лиц. Просмотр сайта не означает согласия на рекламную рассылку.</p>
        </div>}
        {activeDocument === 'consent' && <div className="legal-text">
          <p>Этот раздел носит информационный характер и не является согласием на обработку персональных данных. Просмотр сайта и подтверждение возраста не означают согласия на обработку обращений или получение рекламы.</p>
          <h3>Обращения</h3><p>Контакт: <a href="mailto:switchbrewery@gmail.com">switchbrewery@gmail.com</a>. При отправке письма адресат получает ваш адрес и содержание сообщения. Юридические сведения об операторе и правила обработки обращений необходимо уточнить у владельца сайта.</p>
          <h3>Основание обработки</h3><p>Для обработки обращения требуется применимое законное основание. Если требуется согласие, оно должно быть получено отдельно; само отправление письма не объявляется на этом сайте таким согласием. Запросы о прекращении обработки можно направить на указанный контактный адрес.</p>
          <p>Для первичного вопроса не отправляйте избыточные данные, копии документов и сведения о третьих лицах.</p>
        </div>}
        {activeDocument === 'cookies' && <div className="legal-text">
          <h3>Что используется</h3><p>Прикладной код сайта не устанавливает cookies и не сохраняет настройки в localStorage. Подтверждение возраста хранится только в памяти страницы до её обновления.</p>
          <h3>Инфраструктура</h3><p>Хостинг может вести стандартные технические журналы запросов. Их состав, место и сроки хранения определяются владельцем сайта совместно с выбранным хостинг-провайдером.</p>
          <h3>Аналитика</h3><p>В прикладном коде сайта нет рекламных и аналитических счётчиков. Если они появятся, этот раздел и механизм согласия потребуется обновить.</p>
        </div>}
      </article>
    </div>}
  </>;
}
