const form = document.querySelector('#order-form');
const status = document.querySelector('#form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const message = [
    'Здравствуйте! Хочу заказать NFC-метки для отзывов.',
    '',
    `Имя: ${data.get('name')}`,
    `Телефон: ${data.get('phone')}`,
    `Компания в Яндекс Картах: ${data.get('company')}`,
    `Как связаться: ${data.get('messenger')}`,
    `Количество: ${data.get('quantity')}`,
    `Вариант: ${data.get('design')}`,
  ].join('\n');

  const telegramUrl = `https://t.me/yoekhid?text=${encodeURIComponent(message)}`;
  const telegramWindow = window.open(telegramUrl, '_blank');
  if (telegramWindow) telegramWindow.opener = null;

  status.textContent = telegramWindow
    ? 'Черновик открыт в Telegram. Проверьте данные и отправьте сообщение.'
    : 'Браузер заблокировал новое окно. Откройте Telegram: @yoekhid и отправьте заказ вручную.';
});

const tagStage = document.querySelector('[data-tag-stage]');
const tagModel = document.querySelector('[data-tag-model]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (tagStage && tagModel && !reducedMotion.matches && finePointer.matches) {
  const neutral = { rotateX: 6, rotateY: -10 };
  const motion = { ...neutral, targetX: neutral.rotateX, targetY: neutral.rotateY };
  let frame;

  const renderTag = () => {
    motion.rotateX += (motion.targetX - motion.rotateX) * 0.15;
    motion.rotateY += (motion.targetY - motion.rotateY) * 0.15;

    tagModel.style.transform = `rotateX(${motion.rotateX}deg) rotateY(${motion.rotateY}deg) rotateZ(1deg)`;
    tagModel.style.setProperty('--glare-x', `${50 + motion.rotateY * 2.2}%`);
    tagModel.style.setProperty('--glare-y', `${31 - motion.rotateX * 2.2}%`);

    if (Math.abs(motion.targetX - motion.rotateX) > 0.01 || Math.abs(motion.targetY - motion.rotateY) > 0.01) {
      frame = requestAnimationFrame(renderTag);
    } else {
      frame = undefined;
    }
  };

  const startRender = () => {
    if (!frame) frame = requestAnimationFrame(renderTag);
  };

  tagStage.addEventListener('pointermove', (event) => {
    const bounds = tagStage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    motion.targetY = neutral.rotateY + x * 13;
    motion.targetX = neutral.rotateX - y * 9;
    startRender();
  });

  tagStage.addEventListener('pointerleave', () => {
    motion.targetX = neutral.rotateX;
    motion.targetY = neutral.rotateY;
    startRender();
  });
}
