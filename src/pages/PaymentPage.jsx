import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { wrap } from '../components/layout';
import { media } from '../assets/media';

const emptyForm = {
  codigo: '',
  nombre: '',
  apellidos: '',
  correo: '',
  tarjeta: '',
  vencimiento: '',
  cvv: '',
  monto: '',
  terminos: false,
};

const control =
  'mt-2 block h-[46px] w-full rounded-[4px] border border-line bg-card px-3 font-noto text-sm text-fg outline-none transition placeholder:text-hint focus:border-blue focus:ring-2 focus:ring-blue/30';

function BoxField({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-lg leading-[22px] text-form dark:text-fg">{label}</span>
      <input {...props} className={control} />
    </label>
  );
}

export function PaymentPage() {
  const query = useContent('/payments/payments');

  return <QueryState query={query}>{(data) => <PaymentForm data={data} />}</QueryState>;
}

function PaymentForm({ data }) {
  const [form, setForm] = useState(emptyForm);
  const [receipt, setReceipt] = useState(null);
  const { fields } = data;

  function set(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!form.terminos) return;
    setReceipt({
      nombre: `${form.nombre} ${form.apellidos}`.trim(),
      codigo: form.codigo,
      monto: form.monto,
    });
    setForm(emptyForm);
  }

  return (
    <div className="relative overflow-x-clip pb-[76px] lg:pb-[176px]">
      <img
        src={media['dots-blue']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-97px] top-[306px] w-[211px] rotate-180 opacity-60 lg:left-[-10px] lg:right-auto lg:top-[581px] lg:w-[252px] lg:rotate-180"
      />
      <div className={`${wrap} relative grid gap-[54px] pt-[46px] lg:grid-cols-[1fr_628px] lg:gap-10 lg:pt-[158px] xl:pl-[190px] xl:pr-[257px]`}>
        <div>
          <h1 className="font-display text-2xl font-bold leading-9 text-fg lg:text-[36px] lg:leading-[54px]">{data.title}</h1>
          <h2 className="mt-4 font-display text-sm font-medium text-muted lg:mt-[33px] lg:text-lg">{data.stepsTitle}</h2>
          <ol className="mt-4 flex flex-col items-center gap-[14px] lg:mt-[21px] lg:items-start lg:pl-[60px]">
            {data.steps.map((step) => (
              <li
                key={step.label}
                className="flex h-[52px] w-[318px] items-center gap-5 rounded-[10px] border border-blue bg-card px-4 text-base text-muted"
              >
                <img src={media[step.icon]} alt="" aria-hidden="true" className="h-9 w-9" />
                {step.label}
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-[210px] font-display lg:max-w-[261px] text-sm leading-[21px] text-muted lg:mt-[38px] lg:text-lg lg:leading-[27px]">
            {data.closing}
          </p>
        </div>

        {receipt ? (
          <div className="self-start rounded-xl border border-ink-soft bg-card p-8 lg:mt-9" role="status">
            <h2 className="font-display text-2xl font-bold text-fg">{data.successTitle}</h2>
            <p className="mt-3 text-lg text-muted">{data.successBody}</p>
            <dl className="mt-6 space-y-3 text-lg">
              <div className="flex justify-between gap-4"><dt className="text-muted">Nombre</dt><dd className="font-display font-semibold">{receipt.nombre}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Código</dt><dd className="font-display font-semibold">{receipt.codigo}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Monto</dt><dd className="font-display font-semibold">{data.currency} {receipt.monto}</dd></div>
            </dl>
            <Link to="/" className="mt-8 flex h-[54px] items-center justify-center rounded-[4px] bg-form font-noto text-base font-semibold text-white">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-2 gap-x-[13px] gap-y-6 self-start rounded-xl lg:mt-9 border border-ink-soft bg-card px-[14px] pb-[52px] pt-[42px] lg:gap-x-10 lg:px-8 lg:pb-[52px] lg:pt-[54px]"
          >
            <BoxField
              className="col-span-2"
              label={fields.code.label}
              name="codigo"
              required
              placeholder={fields.code.placeholder}
              value={form.codigo}
              onChange={(event) => set('codigo', event.target.value)}
            />
            <BoxField
              className="col-span-2 sm:col-span-1"
              label={fields.name.label}
              name="nombre"
              autoComplete="given-name"
              required
              value={form.nombre}
              onChange={(event) => set('nombre', event.target.value)}
            />
            <BoxField
              className="col-span-2 sm:col-span-1"
              label={fields.lastName.label}
              name="apellidos"
              autoComplete="family-name"
              required
              value={form.apellidos}
              onChange={(event) => set('apellidos', event.target.value)}
            />
            <BoxField
              className="col-span-2"
              label={fields.email.label}
              name="correo"
              type="email"
              autoComplete="email"
              required
              value={form.correo}
              onChange={(event) => set('correo', event.target.value)}
            />
            <BoxField
              className="col-span-2"
              label={fields.card.label}
              name="tarjeta"
              inputMode="numeric"
              autoComplete="off"
              required
              placeholder={fields.card.placeholder}
              value={form.tarjeta}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
                set('tarjeta', digits.replace(/(\d{4})(?=\d)/g, '$1 '));
              }}
            />
            <BoxField
              label={fields.expiry.label}
              name="vencimiento"
              inputMode="numeric"
              autoComplete="off"
              required
              placeholder={fields.expiry.placeholder}
              value={form.vencimiento}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                set('vencimiento', digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
              }}
            />
            <BoxField
              label={fields.cvv.label}
              name="cvv"
              inputMode="numeric"
              autoComplete="off"
              required
              placeholder={fields.cvv.placeholder}
              value={form.cvv}
              onChange={(event) => set('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))}
            />
            <BoxField
              className="col-span-2"
              label={fields.amount.label}
              name="monto"
              inputMode="decimal"
              required
              placeholder={fields.amount.placeholder}
              value={form.monto}
              onChange={(event) => set('monto', event.target.value.replace(/[^\d.]/g, ''))}
            />
            <label className="col-span-2 mt-[10px] flex cursor-pointer items-center gap-2.5 font-noto text-sm text-form dark:text-fg lg:mt-[10px]">
              <input
                type="checkbox"
                name="terminos"
                required
                checked={form.terminos}
                onChange={(event) => set('terminos', event.target.checked)}
                className="h-6 w-6 shrink-0 cursor-pointer rounded-[4px] border border-line accent-blue"
              />
              {data.terms}
            </label>
            <button
              type="submit"
              className="col-span-2 mt-[7px] h-[54px] rounded-[4px] bg-form font-noto text-base font-semibold text-white transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:bg-action"
            >
              {data.submit}
            </button>
            <p className="col-span-2 -mt-2 text-center text-sm text-muted">{data.disclaimer}</p>
          </form>
        )}
      </div>
    </div>
  );
}
