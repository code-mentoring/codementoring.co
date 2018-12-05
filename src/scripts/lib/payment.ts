// @ts-ignore
import {fetch} from 'whatwg-fetch'

const STRIPE_KEY = '__STRIPE_KEY__';

export const payment = () => {
  // @ts-ignore
  const s = Stripe(STRIPE_KEY);
  const elements = s.elements({
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Open+Sans:400'
      }
    ]
  });

  // Custom styling can be passed to options when creating an Element.
  const style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '18px',
      color: "#32325d",
      fontFamily: 'Open Sans',
      lineHeight: '40px',
      '::placeholder': {
        color: '#3b439b66'
      }
    },
    invalid: {
      color: '#ef94be'
    }
  };

  const options = {
    style,
    classes: {
      focus: 'focus',
      invalid: 'invalid',
      empty: 'placeholder',
      disabled: 'disabled'
    }
  }

  interface FieldNames {
    name: any;
    phone: any;
    email: any;
    cardNumber: any;
    cardExpiry: any;
    cardCvc: any;
  }

  interface Fields {
    plain: {[field in keyof FieldNames]?: any}
    stripe: {[field in keyof FieldNames]?: any}
    button: HTMLButtonElement;
  }

  const form = document.getElementById('payment-form')!;
  const fields: Fields = {
    plain: {
      name: document.getElementById('name')! as HTMLInputElement,
      phone: document.getElementById('phone')! as HTMLInputElement,
      email: document.getElementById('email')! as HTMLInputElement
    },

    stripe: {
      cardNumber: elements.create('cardNumber', options),
      cardExpiry: elements.create('cardExpiry', options),
      cardCvc: elements.create('cardCvc', {...options, placeholder: 'XXX'})
    },

    button: form.querySelector('button')!
  }

  const values: Partial<FieldNames> & {token: string | null} = {
    name: null,
    token: null
  };

  const fieldErrors = {
    form: document.getElementById('formError'),
    name: document.getElementById('nameError'),
    cardNumber: document.getElementById('cardNumberError'),
    cardExpiry: document.getElementById('cardExpiryError'),
    cardCvc: document.getElementById('cardCvcError')
  } as { [key: string]: any};

  // Load the stripe elements
  Object.entries(fields.plain).forEach(([field, input]) => {
    input.addEventListener('change', () => {
      values[field as keyof FieldNames] = input.value;
    });
  });

  // Load the stripe elements
  Object.entries(fields.stripe).forEach(([field, input]) => {
    input.mount(`#${field}`);
  });



  const disableForm = (disabled: boolean = true) => {
    form.classList.toggle('disabled', disabled);

    Object.values(fields.plain).forEach(i => {
      if (disabled) i.setAttribute('disabled', 'disabled');
      else i.removeAttribute('disabled');
    });
    Object.values(fields.stripe).forEach(i => {
      i.update({disabled});
    });

    if (disabled) {
      fields.button.setAttribute('disabled', 'disabled');
      fields.button.textContent = 'Booking...'
    } else {
      fields.button.removeAttribute('disabled');
      fields.button.textContent = 'Book your spot';
    }
  }



  // Create a token or display an error when the form is submitted.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    disableForm();
    fieldErrors.form.textContent = '';

    let err: string | null = null;
    Object.entries(fields.plain).forEach(([field, input]) => {
      if (!input.value && !err) err = `Please enter your ${field}.`;
      input.classList.toggle('invalid', !Boolean(input.value));
    });


    const { token, error } = await s.createToken(fields.stripe.cardNumber);
    if (error) {
      if (!err) err = error.message;
    } else values.token = token.id;

    if (err) fieldErrors.form.textContent = err;
    else {
      const success = await submit();
      if (success) {
        const paymentModal = document.querySelector('.payment-form')!;
        paymentModal.classList.add('successful');
        paymentModal.querySelector('.lanyard span')!.textContent = values.name;
      }
    }

    disableForm(false);
    return false;
  });


  const submit = async() =>
    fetch('/api/v1/payment', {
      method: 'post',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response: Response) => {
        if (response.status >= 200 && response.status < 300) return response;
        else throw new Error(response.statusText);
      })
      .then((r: Response) => r.json())
      .catch((e: Error) => {
        fieldErrors.form.textContent = 'Oops! There was an error submitting the form. Please try again.';
      });
  }
