import { bandLabel, quoteFor, unitPriceFor, isStartingPrice } from './pricing.js'

const root = document.querySelector('#app')
const PRODUCT_IMAGE = '/assets/tag-design.png'
// GitHub Pages project site uses /Ntags; local Node development uses the domain root.
const BASE_PATH = /^\/Ntags(?:\/|$)/i.test(location.pathname) ? '/Ntags' : ''
const TELEGRAM = 'https://t.me/yoekhid'
const CART_KEY = 'ntags-cart-v1'

const getCart = () => {
  try { const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}
let cart = getCart()
const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart))
const cartQty = () => cart.reduce((total, item) => total + item.quantity, 0)
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
const telegramUrl = (message = '') => `${TELEGRAM}?text=${encodeURIComponent(message)}`
const path = () => {
  const pathname = BASE_PATH && location.pathname.toLowerCase().startsWith(BASE_PATH.toLowerCase())
    ? location.pathname.slice(BASE_PATH.length) || '/'
    : location.pathname
  return pathname.replace(/\/$/, '') || '/'
}

function header() {
  const current = path()
  const links = [['/catalog', 'Каталог'], ['/how-it-works', 'Как это работает'], ['/business', 'Для бизнеса'], ['/faq', 'FAQ']]
  return `<div class="announcement"><span class="announcement-dot"></span>NFC + QR · Два способа оставить отзыв <span class="announcement-separator">—</span><span>Для бизнеса и не только</span></div>
  <header class="site-header"><div class="container header-inner"><a href="/" class="brand">Ntags<span>.</span></a>
    <nav class="desktop-nav">${links.map(([href, label]) => `<a href="${href}" class="${current === href ? 'active' : ''}">${label}</a>`).join('')}</nav>
    <div class="header-actions"><a class="header-contact" href="${TELEGRAM}" target="_blank" rel="noreferrer">Связаться ↗</a><a href="/cart" class="cart-button" aria-label="Корзина"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg><span class="cart-count">${cartQty()}</span></a><button class="mobile-menu-button" data-action="menu" aria-label="Открыть меню" aria-expanded="false">☰</button></div>
  </div><nav class="mobile-nav" hidden><a href="/catalog">Каталог</a><a href="/how-it-works">Как это работает</a><a href="/business">Для бизнеса</a><a href="/faq">FAQ</a><a href="/contacts">Контакты</a></nav></header>`
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-top"><div class="footer-brand-block"><a href="/" class="brand brand-footer">Ntags<span>.</span></a><p>Технология, которая помогает<br>сделать следующий шаг проще.</p></div>
    <div class="footer-column"><span>ПРОДУКТ</span><a href="/catalog">Каталог</a><a href="/standard">Standard</a><a href="/custom">Custom</a><a href="/how-it-works">Как это работает</a></div>
    <div class="footer-column"><span>ИНФОРМАЦИЯ</span><a href="/business">Для бизнеса</a><a href="/faq">FAQ</a><a href="/contacts">Контакты</a></div>
    <div class="footer-column footer-contact"><span>СВЯЗЬ</span><a href="${TELEGRAM}" target="_blank" rel="noreferrer">Telegram ↗</a><p>WhatsApp — скоро</p></div></div>
    <div class="container footer-bottom"><span>© 2026 Ntags. Все права защищены.</span><span>Сделано с вниманием к деталям ✳</span></div></footer>
    <a class="floating-telegram" href="${TELEGRAM}" target="_blank" rel="noreferrer"><span class="telegram-symbol">➤</span><span>Есть вопрос?</span></a>`
}

const eyebrow = (text) => `<div class="eyebrow"><span class="eyebrow-line"></span>${text}</div>`
const step = (number, title, text) => `<article class="step-row"><span class="step-number">${number}</span><div><h3>${title}</h3><p>${text}</p></div><span class="step-arrow">↗</span></article>`
const customArt = () => `<div class="custom-art"><div class="custom-art-glow"></div><div class="custom-art-card"><div class="custom-art-brand">ВАШ<br>ЛОГОТИП<span>.</span></div><div class="custom-art-stars">★★★★★</div><div class="custom-art-bottom"><span>ОТЗЫВЫ<br>В ОДНО КАСАНИЕ</span><span class="custom-code">▦</span></div></div><div class="custom-art-note">MADE FOR<br>YOUR BRAND ↗</div></div>`
const productTile = (kind) => {
  const isCustom = kind === 'custom'
  return `<article class="product-tile ${isCustom ? 'tile-custom' : 'tile-standard'}"><div class="tile-top"><span class="tiny-label">${isCustom ? '02 / CUSTOM' : '01 / STANDARD'}</span><span class="tile-tag">${isCustom ? 'ВАШ ФИРМЕННЫЙ СТИЛЬ' : 'ГОТОВОЕ РЕШЕНИЕ'}</span></div>
    ${isCustom ? customArt() : `<div class="tile-image-wrap"><img src="${PRODUCT_IMAGE}" alt="Стандартная NFC-метка Ntags"></div>`}
    <div class="tile-bottom"><div><h3>${isCustom ? 'Custom' : 'Standard'}</h3><p>${isCustom ? 'Индивидуальный дизайн с логотипом, цветами и элементами вашего бренда.' : 'Готовый дизайн Ntags. Настроим ссылку на страницу вашего заведения.'}</p><div class="tile-price-row"><strong>${isCustom ? 'Стоимость по запросу' : 'от 690 ₽ / шт.'}</strong><span>${isCustom ? 'Доставка включена в расчёт' : 'Доставка включена'}</span></div></div><a href="/${kind}" class="round-arrow" aria-label="Подробнее">↗</a></div></article>`
}

function homePage() {
  return `<section class="hero-section"><div class="container hero-grid"><div class="hero-copy">${eyebrow('УМНЫЕ NFC-РЕШЕНИЯ ДЛЯ БИЗНЕСА')}<h1>Отзыв —<br><span>в одно касание.</span></h1><p class="hero-description">Помогите гостям легко находить вашу страницу на Яндекс Картах и делиться впечатлениями. Без лишних действий — с помощью NFC и QR-кода.</p><div class="hero-buttons"><a href="/catalog" class="button button-dark">Выбрать метку ↗</a><a href="/how-it-works" class="button button-light">Как это работает</a></div><div class="hero-proof"><div class="proof-avatars"><span>N</span><span>2Г</span><span>G</span></div><span>Для кафе, ресторанов, магазинов и сервисов</span></div></div>
  <div class="hero-visual tag-hero-visual">
    <div class="visual-topline"><span>NTAGS / STANDARD</span><span>01 / 01</span></div>
    <div class="tag-stage" data-tag-stage>
      <span class="tag-shadow" aria-hidden="true"></span>
      <div class="tag-float-motion" aria-label="3D-модель метки Ntags">
        <figure class="design-frame tag-3d" data-tag-model>
          <span class="tag-edge" aria-hidden="true"></span>
          <span class="tag-face"><img src="${PRODUCT_IMAGE}" alt="Реальная NFC-метка Ntags с QR-кодом для Яндекс Карт"><span class="epoxy-dome" aria-hidden="true"></span></span>
        </figure>
      </div>
      <div class="tag-stage-caption"><span><i></i> NTAGS / PRODUCT 01</span><span>6 × 6 CM</span></div>
    </div>
    <div class="visual-caption">ПОВЕРХНОСТЬ ПОД ПРОЗРАЧНОЙ СМОЛОЙ</div>
  </div></div><div class="container hero-bottom-line"><span>01 / 04</span><span class="hero-bottom-rule"></span><span>SCROLL TO EXPLORE ↘</span></div></section>
  <section class="trust-strip"><div class="container trust-strip-inner"><span>ОДНО КАСАНИЕ</span><span class="trust-cross">✳</span><span>БЫСТРЫЙ ПЕРЕХОД</span><span class="trust-cross">✳</span><span>NFC + QR</span><span class="trust-cross">✳</span><span>ВАШ БРЕНД</span></div></section>
  <section class="section section-intro"><div class="container intro-grid"><div>${eyebrow('МЕНЬШЕ ШАГОВ — БОЛЬШЕ ВОЗМОЖНОСТЕЙ')}<h2>Сделайте обратную связь <span>естественной.</span></h2></div><div class="intro-aside"><p>Не нужно искать заведение вручную или объяснять, куда нажимать. Гость касается метки телефоном или сканирует QR-код — и попадает по нужной ссылке.</p><a href="/how-it-works" class="text-link">Узнать, как это работает ↗</a></div></div>
  <div class="container feature-grid"><article class="feature-card"><div class="feature-card-top"><span>01</span><span class="feature-icon">◉</span></div><h3>NFC в одно касание</h3><p>На совместимых смартфонах достаточно поднести устройство к метке, чтобы открыть нужную ссылку.</p><div class="feature-card-line"></div></article><article class="feature-card"><div class="feature-card-top"><span>02</span><span class="feature-icon">▦</span></div><h3>QR — универсальный способ</h3><p>Если NFC недоступен или не срабатывает, ссылку можно открыть камерой смартфона.</p><div class="feature-card-line"></div></article><article class="feature-card"><div class="feature-card-top"><span>03</span><span class="feature-icon">◇</span></div><h3>Под ваш бизнес</h3><p>Стандартный дизайн или индивидуальное оформление с логотипом и фирменными цветами.</p><div class="feature-card-line"></div></article></div></section>
  <section class="section products-section"><div class="container"><div class="section-heading"><div>${eyebrow('ЛИНЕЙКА NTAGS')}<h2>Два формата.<br><span>Одна простая идея.</span></h2></div><p>Выберите готовое решение или создайте метку, которая продолжит визуальный язык вашего бренда.</p></div><div class="product-tiles">${productTile('standard')}${productTile('custom')}</div></div></section>
  <section class="section steps-section"><div class="container steps-layout"><div class="steps-heading">${eyebrow('ВСЁ ПРОСТО')}<h2>От касания<br>до <span>страницы.</span></h2><p>Никаких сложных инструкций для гостя. Всё, что нужно, уже находится на метке.</p><a href="/how-it-works" class="button button-outline">Посмотреть подробнее ↗</a></div><div class="steps-list">${step('01', 'Гость замечает метку', 'Разместите её на столе, стойке или в зоне обслуживания.')}${step('02', 'Касается или сканирует', 'NFC открывает ссылку автоматически, QR-код — через камеру.')}${step('03', 'Переходит на нужную страницу', 'Гость попадает на страницу, которую вы указали при оформлении заказа.')}</div></div></section>
  <section class="cta-section"><div class="container cta-box"><div>${eyebrow('ГОТОВЫ НАЧАТЬ?')}<h2>Пусть путь к отзыву<br><span>будет короче.</span></h2><p>Подберём формат и тираж под вашу задачу.</p></div><div class="cta-actions"><a href="/catalog" class="button button-white">Выбрать метку ↗</a><a href="${TELEGRAM}" target="_blank" rel="noreferrer" class="cta-telegram">➤ Обсудить в Telegram</a></div><div class="cta-decoration">N.</div></div></section>`
}

function pageIntro(tag, title, description) {
  return `<section class="page-intro"><div class="container">${eyebrow(tag)}<h1>${title}</h1><p>${description}</p></div></section>`
}
function standardPricingSection() {
  const tiers = [
    ['1 шт.', '1 190 ₽', '1 190 ₽ / шт.'],
    ['2–4 шт.', '1 090 ₽', '1 090 ₽ / шт.'],
    ['5–9 шт.', '990 ₽', '990 ₽ / шт.'],
    ['10–19 шт.', '890 ₽', '890 ₽ / шт.'],
    ['20–49 шт.', '790 ₽', '790 ₽ / шт.'],
    ['50+ шт.', 'от 690 ₽', 'от 690 ₽ / шт.'],
  ]
  return `<section class="section standard-pricing-section"><div class="container"><div class="pricing-section-heading">${eyebrow('ПОНЯТНАЯ СТОИМОСТЬ')}<h2>Чем больше тираж,<br><span>тем ниже цена.</span></h2><p>Цена указана за одну готовую метку Standard. Доставка уже включена.</p></div><div class="catalog-pricing-layout"><div class="standard-price-table" aria-label="Цены на Standard в зависимости от количества"><div class="price-table-head"><span>Количество</span><span>Цена за штуку</span></div>${tiers.map(([qty, price, unit]) => `<div class="price-table-row"><span>${qty}</span><strong>${price}</strong></div>`).join('')}<p class="price-table-footnote">Для тиражей от 50 штук указана стартовая цена. Финальная стоимость крупного заказа подтверждается при оформлении.</p></div><div class="catalog-calculator" data-catalog-calculator><span class="tiny-label">БЫСТРЫЙ РАСЧЁТ</span><h3>Сколько меток вам нужно?</h3><p class="calc-description">Выберите количество — стоимость обновится автоматически.</p><label class="field-label" for="catalog-quantity">Количество изделий</label><div class="quantity-control"><button type="button" data-action="catalog-qty-minus" aria-label="Уменьшить количество">−</button><input id="catalog-quantity" type="number" min="1" max="5000" value="10" inputmode="numeric"><button type="button" data-action="catalog-qty-plus" aria-label="Увеличить количество">+</button></div><input class="quantity-slider" id="catalog-quantity-slider" type="range" min="1" max="500" value="10" aria-label="Количество меток"><div class="slider-labels"><span>1 шт.</span><span>500+ шт.</span></div><div class="catalog-calc-result"><div><span data-calc-band>10–19 шт.</span><strong data-calc-total>8 900 ₽</strong><small data-calc-unit>890 ₽ / шт.</small></div><span class="delivery-included"><span aria-hidden="true">✓</span> Доставка включена</span></div><a class="button button-dark button-wide" href="/standard">Перейти к заказу →</a><p class="calc-note">Для Custom стоимость рассчитывается индивидуально.</p></div></div></div></section>`
}
function catalogPage() {
  return `${pageIntro('КАТАЛОГ NTAGS', 'Выберите формат<br><span>для своей задачи.</span>', 'Два способа сделать путь к нужной странице проще. Выберите готовое решение или закажите индивидуальный дизайн.')}<section class="section catalog-section"><div class="container"><div class="product-tiles">${productTile('standard')}${productTile('custom')}</div><div class="catalog-note">✳<p>Standard — готовое решение с открытыми ценами. Custom — индивидуальная разработка с расчётом стоимости под ваш запрос.</p></div></div></section>${standardPricingSection()}`
}
function productPage(kind) {
  const custom = kind === 'custom'
  const product = custom ? 'custom' : 'standard'
  const title = custom ? 'Custom' : 'Standard'
  const quantityDefault = custom ? 5 : 1
  const pricePanel = custom
    ? `<div class="price-summary custom-price-summary"><div><span>Стоимость</span><strong data-price>По запросу</strong></div><small data-price-hint>Рассчитаем индивидуально. Доставка включается в согласованную стоимость.</small></div>`
    : `<div class="price-summary"><div><span data-total-label>Итого за 1 изделие</span><strong data-price>1 190 ₽</strong><small data-unit-price>1 190 ₽ / шт.</small></div><small data-price-hint>Доставка уже включена в стоимость.</small></div>`
  const actionLabel = custom ? 'Добавить запрос в корзину →' : 'Добавить в корзину →'
  return `<div class="container breadcrumb"><a href="/">Главная</a><span>/</span><a href="/catalog">Каталог</a><span>/</span><strong>${title}</strong></div><section class="section product-detail-section"><div class="container product-detail-grid"><div class="product-detail-visual"><div class="detail-image-backdrop"></div><img src="${PRODUCT_IMAGE}" alt="Реальный дизайн NFC-метки Ntags"><span class="detail-image-caption">NTAGS / ${title.toUpperCase()}</span></div><div class="product-detail-copy">${eyebrow(custom ? 'ИНДИВИДУАЛЬНОЕ РЕШЕНИЕ' : 'ГОТОВОЕ РЕШЕНИЕ')}<h1>${custom ? 'Ваш бренд.<br><span>Ваш Ntags.</span>' : 'Знакомый дизайн.<br><span>Простое действие.</span>'}</h1><p class="product-lead">${custom ? 'Создадим оформление с логотипом, цветами и визуальными элементами вашего бренда. Сначала согласуем макет, затем подготовим тираж.' : 'Фирменная NFC-метка с QR-кодом для перехода непосредственно к форме написания отзыва вашего заведения. Основная площадка — Яндекс Карты.'}</p><div class="product-includes"><div>✓ NFC-чип</div><div>✓ QR-код</div><div>✓ Согласование ссылки</div><div>✓ ${custom ? 'Индивидуальный дизайн' : 'Готовый дизайн Ntags'}</div></div>
  <div class="config-panel" data-product="${product}"><div class="config-heading"><span>${custom ? 'ЗАПРОС НА ИЗГОТОВЛЕНИЕ' : 'НАСТРОЙКА ЗАКАЗА'}</span><span data-band>${custom ? 'ИНДИВИДУАЛЬНЫЙ РАСЧЁТ' : bandLabel(product, quantityDefault)}</span></div><label class="field-label" for="quantity">Количество изделий</label><div class="quantity-control"><button type="button" data-action="qty-minus" aria-label="Уменьшить количество">−</button><input id="quantity" type="number" min="1" max="5000" value="${quantityDefault}" inputmode="numeric"><button type="button" data-action="qty-plus" aria-label="Увеличить количество">+</button></div><input class="quantity-slider" id="quantity-slider" type="range" min="1" max="500" value="${Math.min(500, quantityDefault)}" aria-label="Количество меток"><div class="slider-labels"><span>1 шт.</span><span>500+ шт.</span></div><label class="field-label" for="platform">Площадка для перехода</label><select id="platform"><option>Яндекс Карты</option><option>Другая площадка — обсудить лично</option></select><p class="field-hint" data-platform-hint hidden>2ГИС и Google Maps согласуем индивидуально в Telegram.</p><label class="field-label" for="product-note">Комментарий к заказу <span>необязательно</span></label><textarea id="product-note" rows="2" placeholder="${custom ? 'Расскажите о вашем бренде и пожеланиях к дизайну…' : 'Название заведения или пожелания…'}"></textarea>${pricePanel}<button class="button button-dark button-wide" data-action="add-cart">${actionLabel}</button><p class="form-privacy">${custom ? 'После добавления запроса мы уточним детали и подготовим индивидуальную стоимость.' : 'Указанная сумма включает доставку. Добавление в корзину не является оплатой или подтверждением заказа.'}</p></div><div class="product-help"><span>Нужна консультация или другая площадка?</span><a href="${TELEGRAM}" target="_blank" rel="noreferrer">Написать в Telegram ↗</a></div></div></div></section>`
}
function howPage() {
  return `${pageIntro('КАК ЭТО РАБОТАЕТ', 'Пара секунд —<br><span>и вы на нужной странице.</span>', 'Ntags объединяет два понятных способа перейти по ссылке: бесконтактное считывание NFC и привычное сканирование QR-кода.')}<section class="section"><div class="container how-layout"><div class="how-product"><img src="${PRODUCT_IMAGE}" alt="NFC-метка Ntags с инструкцией и QR-кодом"></div><div class="how-steps">${step('01', 'Коснитесь смартфоном', 'Поднесите смартфон к области NFC-метки. На совместимых устройствах появится предложение открыть ссылку.')}${step('02', 'Или отсканируйте QR-код', 'Откройте камеру смартфона и наведите её на QR-код. Нажмите на появившуюся ссылку.')}${step('03', 'Откройте страницу заведения', 'Ссылка ведёт на страницу, которую вы согласовали при оформлении заказа.')}<div class="info-note">ⓘ<p>Для работы NFC нужен совместимый смартфон. Если NFC не поддерживается или не срабатывает, можно воспользоваться QR-кодом.</p></div></div></div></section>`
}
function businessPage() {
  return `${pageIntro('NTAGS ДЛЯ БИЗНЕСА', 'Хороший сервис<br><span>легко заметить.</span>', 'Разместите метки там, где клиенту удобно поделиться впечатлением: на столе, стойке ресепшн или рядом с зоной оплаты.')}<section class="section business-section"><div class="container business-grid"><div class="business-image"><img src="${PRODUCT_IMAGE}" alt="Метка Ntags для заведения"><span class="image-stamp">DESIGNED<br>FOR SERVICE</span></div><div class="business-copy">${eyebrow('ДЛЯ РАЗНЫХ ФОРМАТОВ')}<h2>Один небольшой элемент — <span>понятный сценарий.</span></h2><div class="business-use-list"><div><span>01</span><strong>Рестораны и кафе</strong><p>На столах, у кассы или в зоне выдачи.</p></div><div><span>02</span><strong>Отели и гостиницы</strong><p>На стойке ресепшн или в гостевых зонах.</p></div><div><span>03</span><strong>Магазины и салоны</strong><p>В точке контакта после обслуживания.</p></div></div><a href="${TELEGRAM}" target="_blank" rel="noreferrer" class="button button-dark">Обсудить заказ ↗</a></div></div></section><section class="business-cta"><div class="container business-cta-inner"><div><span class="tiny-label">ДЛЯ КОМАНД И СЕТЕЙ</span><h2>Нужен тираж<br>для нескольких точек?</h2></div><div><p>Расскажите, сколько у вас заведений и какой формат нужен. Обсудим тираж и индивидуальную комплектацию.</p><a href="${TELEGRAM}" target="_blank" rel="noreferrer" class="text-link">Написать в Telegram ↗</a></div></div></section>`
}
const faqs = [
  ['Как работает NFC-метка?', 'В совместимом смартфоне достаточно поднести устройство к метке. Телефон предложит открыть записанную ссылку. В зависимости от модели телефона расположение NFC-антенны может отличаться.'],
  ['Нужно ли устанавливать специальное приложение?', 'Для перехода по NFC-ссылке отдельное приложение обычно не требуется. Для QR-кода достаточно стандартной камеры смартфона.'],
  ['Можно ли сделать переход на 2ГИС или Google Maps?', 'Да. Основной вариант Ntags — Яндекс Карты. Другую площадку можно согласовать индивидуально через Telegram.'],
  ['Можно ли разместить логотип моего заведения?', 'Да, для этого предусмотрен тариф Custom. Мы отдельно согласуем оформление, размещение логотипа и макет до изготовления.'],
  ['Сколько стоит Standard?', 'Цена за одну метку: 1 шт. — 1 190 ₽; 2–4 шт. — 1 090 ₽; 5–9 шт. — 990 ₽; 10–19 шт. — 890 ₽; 20–49 шт. — 790 ₽; от 50 шт. — от 690 ₽. Доставка включена. Custom рассчитывается индивидуально.'],
  ['Включена ли доставка?', 'Да. Доставка включена в опубликованные цены Standard. Для Custom доставка включается в согласованную стоимость заказа.'],
  ['Как оформить заказ?', 'Для Standard выберите тираж: сайт сразу покажет цену за штуку и предварительную сумму с доставкой. Для Custom добавьте запрос в корзину. Затем отправьте заявку в Telegram — мы подтвердим детали и итоговую стоимость.'],
  ['Можно ли изменить ссылку после изготовления?', 'Возможность изменения зависит от способа кодирования ссылки и конструкции изделия. Не обещаем удалённое изменение для каждого изделия: этот вопрос нужно согласовать до заказа.'],
]
function faqPage() {
  return `${pageIntro('ВОПРОСЫ И ОТВЕТЫ', 'Всё важное —<br><span>без мелкого шрифта.</span>', 'Ответы на частые вопросы о NFC, QR-кодах, заказе и индивидуальном оформлении.')}<section class="section faq-section"><div class="container faq-layout"><div class="faq-aside">${eyebrow('НУЖНА ПОМОЩЬ?')}<h2>Не нашли<br><span>ответ?</span></h2><p>Напишите нам. Поможем разобраться и подобрать подходящий формат.</p><a href="${TELEGRAM}" target="_blank" rel="noreferrer" class="button button-dark">Задать вопрос ↗</a></div><div class="faq-list">${faqs.map(([q, a], i) => `<article class="faq-item ${i === 0 ? 'is-open' : ''}"><button data-action="faq" data-index="${i}" aria-expanded="${i === 0}"><span class="faq-index">0${i + 1}</span><strong>${q}</strong><span class="faq-toggle">${i === 0 ? '−' : '+'}</span></button><p ${i === 0 ? '' : 'hidden'}>${a}</p></article>`).join('')}</div></div></section>`
}
function contactsPage() {
  return `${pageIntro('КОНТАКТЫ', 'Давайте обсудим<br><span>вашу задачу.</span>', 'Подскажем, какой формат подойдёт, рассчитаем тираж и обсудим индивидуальный дизайн.')}<section class="section contacts-section"><div class="container contact-card"><div class="contact-main">${eyebrow('НА СВЯЗИ')}<h2>Начнём<br>с сообщения.</h2><p>Основной канал связи Ntags — Telegram. Напишите нам, и мы поможем с выбором или индивидуальным заказом.</p><a class="button button-white" href="${TELEGRAM}" target="_blank" rel="noreferrer">➤ @yoekhid ↗</a></div><div class="contact-options"><div class="contact-option"><span>01 / ОСНОВНОЙ КАНАЛ</span><div><strong>Telegram</strong></div><a href="${TELEGRAM}" target="_blank" rel="noreferrer">@yoekhid ↗</a></div><div class="contact-option contact-option-disabled"><span>02 / ДОПОЛНИТЕЛЬНО</span><div><strong>WhatsApp</strong></div><p>Номер будет добавлен позднее.</p></div></div><div class="contact-watermark">N.</div></div></section>`
}
function plural(n) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'изделие'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'изделия'
  return 'изделий'
}
function formatMoney(amount) {
  return new Intl.NumberFormat('ru-RU').format(amount)
}
function cartLinePrice(item) {
  if (item.product === 'custom') return 'По запросу'
  const total = quoteFor('standard', item.quantity)
  return `${isStartingPrice('standard', item.quantity) ? 'от ' : ''}${formatMoney(total)} ₽`
}
function cartTotalLabel() {
  const standardItems = cart.filter((item) => item.product === 'standard')
  const customItems = cart.some((item) => item.product === 'custom')
  const total = standardItems.reduce((sum, item) => sum + (quoteFor('standard', item.quantity) || 0), 0)
  const from = standardItems.some((item) => isStartingPrice('standard', item.quantity))
  if (!standardItems.length) return 'По запросу'
  const standardLabel = `${from ? 'от ' : ''}${formatMoney(total)} ₽`
  return customItems ? `${standardLabel} + Custom по запросу` : standardLabel
}
function cartPage() {
  if (!cart.length) return `<div class="container breadcrumb"><a href="/">Главная</a><span>/</span><strong>Корзина</strong></div><section class="section cart-section"><div class="container"><div class="cart-title"><div>${eyebrow('ВАШ ЗАКАЗ')}<h1>Корзина<span>.</span></h1></div><span class="cart-total-count">0 изделий</span></div><div class="empty-cart"><div class="empty-cart-icon">♧</div><h2>Пока здесь пусто.</h2><p>Добавьте Standard или Custom, чтобы собрать заказ.</p><a href="/catalog" class="button button-dark">Перейти в каталог →</a></div></div></section>`
  return `<div class="container breadcrumb"><a href="/">Главная</a><span>/</span><strong>Корзина</strong></div><section class="section cart-section"><div class="container"><div class="cart-title"><div>${eyebrow('ВАШ ЗАКАЗ')}<h1>Корзина<span>.</span></h1></div><span class="cart-total-count">${cartQty()} ${plural(cartQty())}</span></div><div class="cart-layout"><div class="cart-items">${cart.map((item) => `<article class="cart-item" data-id="${item.id}"><div class="cart-item-image"><img src="${PRODUCT_IMAGE}" alt="Ntags"></div><div class="cart-item-info"><span class="tiny-label">${item.product.toUpperCase()}</span><h3>${esc(item.title)}</h3><p>${esc(item.platform)}${item.note ? ` · ${esc(item.note)}` : ''}</p><div class="cart-item-controls"><div class="quantity-control quantity-control-small"><button data-action="cart-minus" data-id="${item.id}">−</button><input data-action="cart-quantity" data-id="${item.id}" type="number" min="1" value="${item.quantity}" aria-label="Количество"><button data-action="cart-plus" data-id="${item.id}">+</button></div><button class="remove-button" data-action="remove" data-id="${item.id}">Удалить</button></div></div><div class="cart-item-price">${cartLinePrice(item)}</div></article>`).join('')}<div class="cart-delivery-note"><span>✓</span> Доставка включена в стоимость Standard и будет включена в согласованную стоимость Custom.</div><button class="clear-cart" data-action="clear-cart">Очистить корзину</button></div>
  <aside class="checkout-card"><h2>Оформление заявки</h2><p>Отправьте заказ в Telegram. Мы проверим ссылку, уточним детали и подтвердим итоговую стоимость.</p><form id="checkout-form"><label class="field-label" for="customer-name">Ваше имя</label><input id="customer-name" name="name" required placeholder="Как к вам обращаться"><label class="field-label" for="customer-contact">Телефон или Telegram</label><input id="customer-contact" name="contact" required placeholder="Контакт для связи"><label class="field-label" for="customer-comment">Комментарий <span>необязательно</span></label><textarea id="customer-comment" name="comment" rows="3" placeholder="Город, сроки или другие детали"></textarea><div class="checkout-total"><span>Предварительная сумма</span><strong>${cartTotalLabel()}</strong></div><button class="button button-dark button-wide" type="submit">Отправить заявку в Telegram →</button><small>Для Standard сумма рассчитана по прайсу и включает доставку. Custom рассчитывается индивидуально. Это заявка, а не онлайн-оплата.</small><p class="form-error" id="checkout-error" hidden></p></form></aside></div></div></section>`
}
function notFoundPage() {
  return `<section class="section not-found"><div class="container"><span class="not-found-code">404</span><h1>Кажется, эта страница<br><span>куда-то ушла.</span></h1><a href="/" class="button button-dark">На главную ↗</a></div></section>`
}

function render() {
  const titles = { '/': 'Ntags — отзыв в одно касание', '/catalog': 'Каталог — Ntags', '/standard': 'Standard — Ntags', '/custom': 'Custom — Ntags', '/how-it-works': 'Как это работает — Ntags', '/business': 'Для бизнеса — Ntags', '/faq': 'FAQ — Ntags', '/contacts': 'Контакты — Ntags', '/cart': 'Корзина — Ntags' }
  document.title = titles[path()] || 'Ntags — страница не найдена'
  const routes = {
    '/': homePage, '/catalog': catalogPage, '/standard': () => productPage('standard'), '/custom': () => productPage('custom'),
    '/how-it-works': howPage, '/business': businessPage, '/faq': faqPage, '/contacts': contactsPage, '/cart': cartPage,
  }
  const page = (routes[path()] || notFoundPage)()
  root.innerHTML = `${header()}<main>${page}</main>${footer()}`
  if (BASE_PATH) {
    root.querySelectorAll('[href^="/"], [src^="/"]').forEach((element) => {
      for (const attribute of ['href', 'src']) {
        const value = element.getAttribute(attribute)
        if (value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith(`${BASE_PATH}/`)) {
          element.setAttribute(attribute, `${BASE_PATH}${value}`)
        }
      }
    })
  }
  if (path() === '/') initTag3D()
  initScrollReveals()
  if (path() === '/standard' || path() === '/custom') updateProductQuote()
  if (path() === '/catalog') updateCatalogCalculator()
}

function initTag3D() {
  const stage = document.querySelector('[data-tag-stage]')
  const model = stage?.querySelector('[data-tag-model]')
  if (!stage || !model || stage.dataset.initialized === 'true') return
  stage.dataset.initialized = 'true'
  stage.dataset.effectReady = 'true'

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const neutral = { x: 13, y: -19, z: -4, shineX: 38, shineY: 24, shadowX: 0 }
  const current = { ...neutral }
  const target = { ...neutral }
  const velocity = { x: 0, y: 0, z: 0, shineX: 0, shineY: 0, shadowX: 0 }
  const keys = Object.keys(neutral)
  let raf = 0
  let lastTime = 0

  const writeFrame = () => {
    model.style.setProperty('--ntags-rotate-x', `${current.x.toFixed(2)}deg`)
    model.style.setProperty('--ntags-rotate-y', `${current.y.toFixed(2)}deg`)
    model.style.setProperty('--ntags-rotate-z', `${current.z.toFixed(2)}deg`)
    model.style.setProperty('--ntags-shine-x', `${current.shineX.toFixed(1)}%`)
    model.style.setProperty('--ntags-shine-y', `${current.shineY.toFixed(1)}%`)
    stage.style.setProperty('--ntags-shadow-x', `${current.shadowX.toFixed(1)}px`)
  }

  // Independent critically-damped springs keep each axis interruptible.
  // New pointer input retargets the live presentation value without resetting velocity.
  const tick = (now) => {
    const dt = Math.min(0.032, Math.max(0.001, (now - (lastTime || now - 16.67)) / 1000))
    lastTime = now
    const stiffness = reduceMotion ? 250 : 190
    const damping = reduceMotion ? 31 : 26
    let energy = 0

    for (const key of keys) {
      const acceleration = stiffness * (target[key] - current[key]) - damping * velocity[key]
      velocity[key] += acceleration * dt
      current[key] += velocity[key] * dt
      energy += Math.abs(target[key] - current[key]) + Math.abs(velocity[key]) * 0.025
    }

    writeFrame()
    if (energy > 0.035) {
      raf = requestAnimationFrame(tick)
    } else {
      for (const key of keys) {
        current[key] = target[key]
        velocity[key] = 0
      }
      writeFrame()
      raf = 0
      lastTime = 0
    }
  }

  const animateToTarget = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }

  const move = (event) => {
    if (event.pointerType === 'touch' || reduceMotion) return
    const bounds = stage.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2))
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2))

    target.y = neutral.y + x * 25
    target.x = neutral.x - y * 17
    target.z = neutral.z + x * 3.5
    target.shineX = 24 + (x + 1) * 26
    target.shineY = 12 + (y + 1) * 25
    target.shadowX = x * 23
    stage.classList.add('is-interacting')
    animateToTarget()
  }

  const reset = () => {
    // Preserve current velocity: the return motion continues from the exact live state.
    Object.assign(target, neutral)
    stage.classList.remove('is-interacting')
    animateToTarget()
  }

  writeFrame()
  if (!reduceMotion) {
    stage.addEventListener('pointermove', move, { passive: true })
    stage.addEventListener('pointerleave', reset, { passive: true })
    stage.addEventListener('pointerdown', move, { passive: true })
  }
}

function initScrollReveals() {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  if (reduceMotion || !('IntersectionObserver' in window)) return

  const targets = root.querySelectorAll('.feature-card, .product-tile, .step-row, .faq-item, .price-card, .contact-option')
  if (!targets.length) return
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })

  targets.forEach((element, index) => {
    element.classList.add('reveal-on-scroll')
    element.style.transitionDelay = `${(index % 3) * 55}ms`
    observer.observe(element)
  })
}
function updateProductQuote() {
  const panel = document.querySelector('[data-product]')
  if (!panel) return
  const product = panel.dataset.product
  const quantityInput = panel.querySelector('#quantity')
  const quantity = Math.max(1, Math.min(5000, Number(quantityInput.value) || 1))
  quantityInput.value = String(quantity)
  panel.querySelector('[data-band]').textContent = bandLabel(product, quantity)
  const price = quoteFor(product, quantity)
  const priceNode = panel.querySelector('[data-price]')
  const hintNode = panel.querySelector('[data-price-hint]')
  const unitNode = panel.querySelector('[data-unit-price]')
  const totalLabel = panel.querySelector('[data-total-label]')
  if (priceNode) priceNode.textContent = price === null ? 'По запросу' : `${isStartingPrice(product, quantity) ? 'от ' : ''}${formatMoney(price)} ₽`
  if (unitNode) {
    const unit = unitPriceFor(product, quantity)
    unitNode.textContent = unit === null ? 'Индивидуальный расчёт' : `${isStartingPrice(product, quantity) ? 'от ' : ''}${formatMoney(unit)} ₽ / шт.`
  }
  if (totalLabel) totalLabel.textContent = `Итого за ${quantity} ${plural(quantity)}`
  if (hintNode) hintNode.textContent = product === 'custom'
    ? 'Стоимость зависит от тиража и сложности дизайна. Доставка включается в согласованную стоимость.'
    : quantity >= 50
      ? 'Стартовая цена для тиража от 50 шт. Доставка включена; точную стоимость подтвердим перед изготовлением.'
      : 'Доставка уже включена в стоимость. Никаких дополнительных сборов за доставку в расчёте.'
  panel.querySelector('#quantity-slider').value = String(Math.min(500, quantity))
}

function updateCatalogCalculator() {
  const calculator = document.querySelector('[data-catalog-calculator]')
  if (!calculator) return
  const quantityInput = calculator.querySelector('#catalog-quantity')
  const quantity = Math.max(1, Math.min(5000, Number(quantityInput.value) || 1))
  quantityInput.value = String(quantity)
  const total = quoteFor('standard', quantity)
  const unit = unitPriceFor('standard', quantity)
  calculator.querySelector('[data-calc-band]').textContent = bandLabel('standard', quantity)
  calculator.querySelector('[data-calc-total]').textContent = `${isStartingPrice('standard', quantity) ? 'от ' : ''}${formatMoney(total)} ₽`
  calculator.querySelector('[data-calc-unit]').textContent = `${isStartingPrice('standard', quantity) ? 'от ' : ''}${formatMoney(unit)} ₽ / шт.`
  calculator.querySelector('#catalog-quantity-slider').value = String(Math.min(500, quantity))
}
function addCurrentProduct() {
  const panel = document.querySelector('[data-product]')
  const product = panel.dataset.product
  const quantity = Math.max(1, Math.min(5000, Number(panel.querySelector('#quantity').value) || 1))
  const platform = panel.querySelector('#platform').value
  const note = panel.querySelector('#product-note').value.trim()
  cart.push({ id: `${product}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, product, title: `Ntags ${product === 'custom' ? 'Custom' : 'Standard'}`, quantity, platform, note })
  saveCart()
  const button = panel.querySelector('[data-action="add-cart"]')
  button.textContent = product === 'custom' ? '✓ Запрос добавлен' : '✓ Добавлено в корзину'
  setTimeout(() => { if (button.isConnected) button.textContent = product === 'custom' ? 'Добавить запрос в корзину →' : 'Добавить в корзину →' }, 2200)
  const counter = document.querySelector('.cart-count')
  if (counter) counter.textContent = String(cartQty())
}

root.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]')
  if (!actionButton) return
  const action = actionButton.dataset.action
  if (action === 'menu') {
    const menu = document.querySelector('.mobile-nav')
    menu.hidden = !menu.hidden
    actionButton.textContent = menu.hidden ? '☰' : '×'
    actionButton.setAttribute('aria-expanded', String(!menu.hidden))
  }
  if (action === 'qty-minus' || action === 'qty-plus') {
    const input = document.querySelector('#quantity')
    input.value = String(Math.max(1, Math.min(5000, Number(input.value || 1) + (action === 'qty-plus' ? 1 : -1))))
    updateProductQuote()
  }
  if (action === 'catalog-qty-minus' || action === 'catalog-qty-plus') {
    const input = document.querySelector('#catalog-quantity')
    if (input) { input.value = String(Math.max(1, Math.min(5000, Number(input.value || 1) + (action === 'catalog-qty-plus' ? 1 : -1)))); updateCatalogCalculator() }
  }
  if (action === 'add-cart') addCurrentProduct()
  if (action === 'faq') {
    const item = actionButton.closest('.faq-item')
    const open = item.classList.toggle('is-open')
    item.querySelector('p').hidden = !open
    actionButton.setAttribute('aria-expanded', String(open))
    actionButton.querySelector('.faq-toggle').textContent = open ? '−' : '+'
  }
  if (action === 'cart-minus' || action === 'cart-plus') {
    const item = cart.find((entry) => entry.id === actionButton.dataset.id)
    if (item) item.quantity = Math.max(1, item.quantity + (action === 'cart-plus' ? 1 : -1))
    saveCart(); render()
  }
  if (action === 'remove') { cart = cart.filter((item) => item.id !== actionButton.dataset.id); saveCart(); render() }
  if (action === 'clear-cart') { cart = []; saveCart(); render() }
})

root.addEventListener('input', (event) => {
  if (event.target.id === 'quantity') updateProductQuote()
  if (event.target.id === 'quantity-slider') {
    document.querySelector('#quantity').value = event.target.value
    updateProductQuote()
  }
  if (event.target.id === 'catalog-quantity') updateCatalogCalculator()
  if (event.target.id === 'catalog-quantity-slider') {
    document.querySelector('#catalog-quantity').value = event.target.value
    updateCatalogCalculator()
  }
  if (event.target.dataset.action === 'cart-quantity') {
    const item = cart.find((entry) => entry.id === event.target.dataset.id)
    if (item) { item.quantity = Math.max(1, Number(event.target.value) || 1); saveCart(); const count = document.querySelector('.cart-total-count'); if (count) count.textContent = `${cartQty()} ${plural(cartQty())}` }
  }
})
root.addEventListener('change', (event) => {
  if (event.target.id === 'platform') {
    const hint = document.querySelector('[data-platform-hint]')
    if (hint) hint.hidden = event.target.value === 'Яндекс Карты'
  }
  if (event.target.dataset.action === 'cart-quantity') render()
})
root.addEventListener('submit', (event) => {
  if (event.target.id !== 'checkout-form') return
  event.preventDefault()
  const form = new FormData(event.target)
  const name = String(form.get('name') || '').trim()
  const contact = String(form.get('contact') || '').trim()
  const comment = String(form.get('comment') || '').trim()
  const error = document.querySelector('#checkout-error')
  if (!name || !contact) { error.textContent = 'Укажите имя и контакт для обратной связи.'; error.hidden = false; return }
  const list = cart.map((item, index) => {
    const priceLine = item.product === 'custom' ? 'Стоимость: индивидуальный расчёт' : `Стоимость: ${cartLinePrice(item)} (${isStartingPrice('standard', item.quantity) ? 'стартовая цена' : `${formatMoney(unitPriceFor('standard', item.quantity))} ₽ / шт.`})`
    return `${index + 1}. ${item.title}\nКоличество: ${item.quantity}\nПлощадка: ${item.platform}\n${priceLine}\nДоставка: включена${item.note ? `\nКомментарий: ${item.note}` : ''}`
  }).join('\n\n')
  const message = `Здравствуйте! Хочу оформить заказ Ntags.\n\n${list}\n\nИмя: ${name}\nКонтакт для связи: ${contact}\nКомментарий: ${comment || 'Нет'}\n\nПодтвердите, пожалуйста, итоговую стоимость и сроки.`
  window.open(telegramUrl(message), '_blank', 'noopener,noreferrer')
})

render()