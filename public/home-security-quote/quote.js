const form = document.getElementById('quote');
const state = new URLSearchParams(location.search).get('state');
if (state && Array.from(form.elements.State.options).some(option => option.value === state)) form.elements.State.value = state;
const button = form.querySelector('button[type=submit]');
const feedback = document.getElementById('feedback');
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled) return;
  button.disabled = true;
  button.textContent = 'Sending your request…';
  feedback.textContent = '';
  try {
    const response = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new URLSearchParams(new FormData(form)) });
    if (response.status === 429) throw new Error('Please wait a minute before trying again.');
    const result = await response.json();
    if (!response.ok || !result.received) throw new Error(result.error || 'Please try again.');
    location.replace('/home-security-quote/thanks/');
  } catch (e) {
    feedback.textContent = e instanceof TypeError || e instanceof SyntaxError ? 'We couldn’t confirm your request. Check your connection and try again.' : e.message;
    button.disabled = false;
    button.textContent = 'Request my free quote';
  }
});
