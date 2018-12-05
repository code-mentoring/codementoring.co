import './types/window';
import {scroll} from './lib/scroll';
import {payment} from './lib/payment';
import {modal} from './lib/modal';

window.addEventListener("load", () => {
  scroll();
  payment();
  modal();
});
