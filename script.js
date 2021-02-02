window.onload = () => {
    const html = document.querySelector('html');
    const checkbox = document.getElementById('checkbox');
  
    checkbox.addEventListener('change', () => {
      html.classList.toggle('dark-mode')
    });
  }