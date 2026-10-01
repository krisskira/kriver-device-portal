import type { PaymentsContent, SiteContent } from '../types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { wrap } from '../components/layout';
import { media } from '../assets/media';
import { useI18n } from '../hooks/useI18n';

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

function BoxField({ label, className = '', ...props }: any) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-lg leading-[22px] text-form dark:text-fg">{label}</span>
      <input {...props} className={control} />
    </label>
  );
}

export function PaymentPage() {
  const query = useContent<PaymentsContent>('/payments/payments');
  const site = useContent<SiteContent>('/site/site');

  return (
    <QueryState query={query}>
      {(data: any) => (
        <>
          <PaymentForm data={data} />
          <PaymentMethods data={data} whatsapp={site.data?.whatsapp} />
        </>
      )}
    </QueryState>
  );
}

function methodHref(method: any, data: any, whatsapp: any) {
  if (method.url) return method.url;
  if (!whatsapp) return undefined;
  const text = data.requestMessage.replace('{method}', method.name);
  return `${whatsapp}?text=${encodeURIComponent(text)}`;
}

function PaymentMethods({ data, whatsapp }: any) {
  const { t } = useI18n();
  if (!data.methods?.length) return null;

  return (
    <section id="metodos" aria-labelledby="metodos-title" className="scroll-mt-[90px] pb-[76px] lg:pb-[140px]">
      <div className={`${wrap} xl:pl-[190px] xl:pr-[257px]`}>
        <h2 id="metodos-title" className="font-display text-2xl font-bold leading-9 text-fg lg:text-[32px] lg:leading-[48px]">
          {data.methodsTitle}
        </h2>
        <p className="mt-3 max-w-[640px] text-base leading-7 text-muted lg:text-lg">{data.methodsLead}</p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {data.methods.map((method: any) => {
            const href = methodHref(method, data, whatsapp);
            const external = /^https?:/.test(href || '');
            const label = method.url ? method.cta : data.requestLink;
            return (
              <li key={method.id} className="flex flex-col rounded-xl border border-ink-soft bg-card p-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold text-white"
                  style={{ backgroundColor: method.color }}
                >
                  {method.name.charAt(0)}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-fg">{method.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted lg:text-base">{method.text}</p>
                {href ? (
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={external ? t('footer.newTab', { label: `${label} · ${method.name}` }) : undefined}
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-[4px] bg-form px-4 font-noto text-sm font-semibold text-white transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:bg-action"
                  >
                    {label}
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function PaymentForm({ data }: any) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [receipt, setReceipt] = useState<{ nombre: string; codigo: string; monto: string } | null>(null);
  const { fields } = data;

  function set(name: any, value: any) {
    setForm((current: any) => ({ ...current, [name]: value }));
  }

  function onSubmit(event: any) {
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
    <div className="relative overflow-x-clip pb-[64px] lg:pb-[120px]">
      <img
        src={media['dots-blue']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-97px] top-[306px] w-[211px] rotate-180 opacity-60 lg:left-[-10px] lg:right-auto lg:top-[760px] lg:w-[252px] lg:rotate-180"
      />
      <div className={`${wrap} relative grid gap-[54px] pt-[46px] lg:grid-cols-[1fr_628px] lg:gap-10 lg:pt-[158px] xl:pl-[190px] xl:pr-[257px]`}>
        <div>
          <h1 className="font-display text-2xl font-bold leading-9 text-fg lg:text-[36px] lg:leading-[54px]">{data.title}</h1>
          <h2 className="mt-4 font-display text-sm font-medium text-muted lg:mt-[33px] lg:text-lg">{data.stepsTitle}</h2>
          <ol className="mt-4 flex flex-col items-center gap-[14px] lg:mt-[21px] lg:items-start lg:pl-[60px]">
            {data.steps.map((step: any) => (
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
          {data.methods?.length ? (
            <a
              href="#metodos"
              className="mt-6 inline-block font-display text-sm font-semibold text-action underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue dark:text-blue lg:text-base"
            >
              {data.methodsLink} ↓
            </a>
          ) : null}
        </div>

        {receipt ? (
          <div className="self-start rounded-xl border border-ink-soft bg-card p-8 lg:mt-9" role="status">
            <h2 className="font-display text-2xl font-bold text-fg">{data.successTitle}</h2>
            <p className="mt-3 text-lg text-muted">{data.successBody}</p>
            <dl className="mt-6 space-y-3 text-lg">
              <div className="flex justify-between gap-4"><dt className="text-muted">{t('payment.name')}</dt><dd className="font-display font-semibold">{receipt.nombre}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">{t('payment.code')}</dt><dd className="font-display font-semibold">{receipt.codigo}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">{t('payment.amount')}</dt><dd className="font-display font-semibold">{data.currency} {receipt.monto}</dd></div>
            </dl>
            <Link to="/" className="mt-8 flex h-[54px] items-center justify-center rounded-[4px] bg-form font-noto text-base font-semibold text-white">
              {t('payment.back')}
            </Link>
          </div>
        ) : (
          <form
            id="formulario"
            onSubmit={onSubmit}
            className="scroll-mt-[90px] grid grid-cols-2 gap-x-[13px] gap-y-6 self-start rounded-xl lg:mt-9 border border-ink-soft bg-card px-[14px] pb-[52px] pt-[42px] lg:gap-x-10 lg:px-8 lg:pb-[52px] lg:pt-[54px]"
          >
            <BoxField
              className="col-span-2"
              label={fields.code.label}
              name="codigo"
              required
              placeholder={fields.code.placeholder}
              value={form.codigo}
              onChange={(event: any) => set('codigo', event.target.value)}
            />
            <BoxField
              className="col-span-2 sm:col-span-1"
              label={fields.name.label}
              name="nombre"
              autoComplete="given-name"
              required
              value={form.nombre}
              onChange={(event: any) => set('nombre', event.target.value)}
            />
            <BoxField
              className="col-span-2 sm:col-span-1"
              label={fields.lastName.label}
              name="apellidos"
              autoComplete="family-name"
              required
              value={form.apellidos}
              onChange={(event: any) => set('apellidos', event.target.value)}
            />
            <BoxField
              className="col-span-2"
              label={fields.email.label}
              name="correo"
              type="email"
              autoComplete="email"
              required
              value={form.correo}
              onChange={(event: any) => set('correo', event.target.value)}
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
              onChange={(event: any) => {
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
              onChange={(event: any) => {
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
              onChange={(event: any) => set('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))}
            />
            <BoxField
              className="col-span-2"
              label={fields.amount.label}
              name="monto"
              inputMode="decimal"
              required
              placeholder={fields.amount.placeholder}
              value={form.monto}
              onChange={(event: any) => set('monto', event.target.value.replace(/[^\d.]/g, ''))}
            />
            <label className="col-span-2 mt-[10px] flex cursor-pointer items-center gap-2.5 font-noto text-sm text-form dark:text-fg lg:mt-[10px]">
              <input
                type="checkbox"
                name="terminos"
                required
                checked={form.terminos}
                onChange={(event: any) => set('terminos', event.target.checked)}
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
