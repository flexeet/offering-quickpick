// SHA-256 hash — password never stored in plaintext
const _H = 'dd88f565c19a4f644c9be97a4ddc4d86d6c966fb230ea16bc182ac6eb383b002';

async function _s(t) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
}

window.checkAuth = async function () {
  const v = document.getElementById('pwd-input').value;
  const h = await _s(v);
  if (h === _H) {
    sessionStorage.setItem('_qa', _H);
    document.getElementById('auth-gate').remove();
    document.getElementById('app').style.display = 'block';
    window.loadSections();
  } else {
    document.getElementById('auth-error').style.display = 'block';
    document.getElementById('pwd-input').value = '';
    document.getElementById('pwd-input').focus();
    setTimeout(() => { document.getElementById('auth-error').style.display = 'none'; }, 3000);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('_qa') === _H) {
    document.getElementById('auth-gate').remove();
    document.getElementById('app').style.display = 'block';
    window.loadSections();
  }
});
