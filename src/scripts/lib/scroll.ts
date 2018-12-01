export const scroll = () => {
  const bookSection = document.getElementById('book-now')!;
  const float = bookSection.querySelector('.float')!;

  document.addEventListener('scroll', (e) => {
    const posY = bookSection.getBoundingClientRect().top
      - window.innerHeight
      +  130 // float.getBoundingClientRect().height;

    float.classList.toggle('stick', posY <= 0);
  });
}
