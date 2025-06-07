export function transitionHelper({ updateDOM }) {
  const content = document.getElementById('main-content') || document.getElementById('app');

  if (!content) {
    return {
      updateCallbackDone: Promise.resolve(updateDOM()),
    };
  }

  return new Promise((resolve) => {
    content.classList.add('fade-out');

    content.addEventListener('transitionend', async function handleFadeOut() {
      content.removeEventListener('transitionend', handleFadeOut);
      await updateDOM();

      content.classList.remove('fade-out');
      content.classList.add('fade-in');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          content.classList.remove('fade-in');
          resolve();
        });
      });
    });
  }).then(() => ({ updateCallbackDone: Promise.resolve() }));
}
