import '../types/window';

export const modal = () => {
  const modals = Array.from(document.querySelectorAll('.modal'));

  const closeModal = (m: Element) => () => {
    m.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  window.openModal = (m: Element | string) => {
    let modal = m;
    if (typeof modal === 'string') modal = document.querySelector(modal)!;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  Array.from(document.querySelectorAll('*[data-modal]')).forEach(ele => {
    const m = ele.getAttribute('data-modal')!;
    ele.addEventListener('click', () => window.openModal(m));
  })


  modals.forEach(m => {
    const back = m.querySelector('.back')!;
    const btnClose = m.querySelector('aside img.close')!;

    back.addEventListener('click', closeModal(m));
    btnClose.addEventListener('click', closeModal(m));
  });

}
