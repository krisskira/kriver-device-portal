import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, Loader2, Lock, Mail, Send, X } from 'lucide-react';
import { media } from '../assets/media';
import { useContent } from '../hooks/useContent';
import { WhatsAppIcon } from './icons';
import { TricolorBar } from './ui';

const MAX_FILE = 5 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const stepColors = ['bg-yellow text-ink', 'bg-red text-white', 'bg-blue text-ink'];

const lineControl =
  'peer block w-full rounded-none border-0 border-b border-paper/45 bg-transparent pb-2.5 pt-6 text-base leading-6 text-paper outline-none transition-colors placeholder:text-transparent hover:border-paper/80 focus:border-blue-soft aria-[invalid=true]:border-[#ff9d9d]';

const floatingLabel =
  'pointer-events-none absolute left-0 top-0 text-xs font-semibold tracking-wide text-blue-soft transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-paper/75 peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:tracking-wide peer-focus:text-blue-soft';

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-[#ff9d9d]">
      <AlertCircle size={14} aria-hidden="true" />
      {children}
    </p>
  );
}

function LineField({ label, name, error, required, className = '', ...props }) {
  const id = `contacto-${name}`;
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={name}
        placeholder=" "
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={lineControl}
        {...props}
      />
      <label htmlFor={id} className={floatingLabel}>
        {label}
        {required ? <span aria-hidden="true" className="text-yellow"> *</span> : null}
      </label>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

function ChoiceGroup({ legend, name, type, options, defaultValue, className = '' }) {
  return (
    <fieldset className={className}>
      <legend className="text-xs font-semibold tracking-wide text-blue-soft">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type={type}
              name={name}
              value={option}
              defaultChecked={option === defaultValue}
              className="peer sr-only"
            />
            <span className="inline-flex items-center rounded-full border border-paper/40 px-3.5 py-1.5 text-sm text-paper transition hover:border-paper peer-checked:border-yellow peer-checked:bg-yellow peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-yellow">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function formatSize(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function validate(form, file, errors) {
  const data = new FormData(form);
  const found = {};
  if (String(data.get('nombre')).trim().length < 2) found.name = errors.name;
  if (!EMAIL.test(String(data.get('correo')).trim())) found.email = errors.email;
  if (String(data.get('telefono')).replace(/\D/g, '').length < 7) found.phone = errors.phone;
  if (String(data.get('mensaje')).trim().length < 20) found.message = errors.message;
  if (file && (file.type !== 'application/pdf' || file.size > MAX_FILE)) found.file = errors.file;
  return { found, data };
}

export function ContactSection({ contact }) {
  const { data: site } = useContent('/site/site');
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [result, setResult] = useState({ name: '', whatsapp: '' });
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const successRef = useRef(null);
  const timer = useRef(0);
  const { fields, attachment } = contact;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (status === 'sent') successRef.current?.focus();
  }, [status]);

  function pickFile(next) {
    setFile(next || null);
    if (next && (next.type !== 'application/pdf' || next.size > MAX_FILE)) {
      setErrors((current) => ({ ...current, file: contact.errors.file }));
    } else {
      setErrors((current) => ({ ...current, file: undefined }));
    }
  }

  function removeFile() {
    if (fileRef.current) fileRef.current.value = '';
    pickFile(null);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files;
    if (!dropped?.length) return;
    if (fileRef.current) fileRef.current.files = dropped;
    pickFile(dropped[0]);
  }

  function onChange(event) {
    if (event.target.name === 'mensaje') setMessageLength(event.target.value.length);
    if (attempted) setErrors(validate(formRef.current, file, contact.errors).found);
  }

  function onSubmit(event) {
    event.preventDefault();
    const { found, data } = validate(event.currentTarget, file, contact.errors);
    setErrors(found);
    setAttempted(true);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    const name = String(data.get('nombre')).trim();
    const services = data.getAll('servicios').join(', ');
    const text = [
      `Hola, soy ${name}${data.get('empresa') ? ` de ${String(data.get('empresa')).trim()}` : ''}.`,
      services ? `Me interesa: ${services}.` : '',
      String(data.get('mensaje')).trim(),
    ]
      .filter(Boolean)
      .join(' ');
    const whatsapp = site?.whatsapp ? `${site.whatsapp}?text=${encodeURIComponent(text)}` : '';

    setStatus('sending');
    timer.current = window.setTimeout(() => {
      setResult({ name: name.split(/\s+/)[0], whatsapp });
      setStatus('sent');
    }, 900);
  }

  function reset() {
    setStatus('idle');
    setErrors({});
    setAttempted(false);
    setFile(null);
    setMessageLength(0);
  }

  const hasErrors = attempted && Object.values(errors).some(Boolean);
  const channels = [
    site?.email && { href: `mailto:${site.email}`, label: site.email, icon: <Mail size={18} aria-hidden="true" /> },
    site?.whatsapp && {
      href: site.whatsapp,
      label: 'WhatsApp',
      icon: <WhatsAppIcon size={18} />,
      external: true,
    },
  ].filter(Boolean);

  const channelLinks = channels.map((channel) => (
    <a
      key={channel.href}
      href={channel.href}
      {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex items-center gap-2 rounded-full border border-paper/35 bg-white/5 px-4 py-2 text-sm text-paper transition hover:border-yellow hover:text-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
    >
      {channel.icon}
      {channel.label}
      {channel.external ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
    </a>
  ));

  return (
    <section
      id={contact.id}
      aria-labelledby="contacto-title"
      className="relative mt-[99px] scroll-mt-[90px] overflow-x-clip md:mt-[242px]"
    >
      <img
        src={media['dots-vertical']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6px] top-[233px] hidden w-[122px] lg:block"
      />
      <div className="relative overflow-hidden rounded-tr-[20px] bg-panel lg:grid lg:min-h-[916px] lg:w-[91.5%] lg:grid-cols-[53.2%_1fr] lg:rounded-tr-[60px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl"
        />
        <div className="relative hidden lg:block">
          <img
            src={media.contact}
            alt="Persona trabajando en su portátil junto a una ventana"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover [clip-path:polygon(0_0,100%_0,86.7%_100%,0_100%)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[rgba(20,20,20,0.85)] via-[rgba(30,30,30,0.25)] to-[rgba(37,37,37,0.1)] [clip-path:polygon(0_0,100%_0,86.7%_100%,0_100%)]"
          />
          <aside className="absolute bottom-12 left-10 right-[22%] rounded-2xl border border-white/15 bg-[rgba(24,24,24,0.72)] p-7 text-paper shadow-card backdrop-blur-md">
            <ol className="space-y-3">
              {contact.aside.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3 text-base">
                  <span
                    aria-hidden="true"
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-md font-display text-sm font-semibold ${stepColors[index % stepColors.length]}`}
                  >
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <hr className="my-6 border-white/15" />
            <p className="font-display text-lg font-semibold">{contact.aside.title}</p>
            <p className="mt-1.5 text-sm leading-6 text-paper/80">{contact.aside.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">{channelLinks}</div>
          </aside>
        </div>

        <div className="relative px-5 pb-16 pt-12 sm:px-10 lg:py-16 lg:pl-[5%] lg:pr-[14%]">
          <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.14em] text-yellow">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-yellow" />
            {contact.kicker}
          </p>
          <h2
            id="contacto-title"
            className="mt-3 font-display text-[28px] font-bold leading-9 text-white lg:text-[40px] lg:leading-[52px]"
          >
            {contact.title}
          </h2>
          <p className="mt-3 max-w-[520px] text-base leading-7 text-paper/85 lg:text-lg">{contact.lead}</p>
          <div className="mt-5 flex flex-wrap gap-2 lg:hidden">{channelLinks}</div>

          {status === 'sent' ? (
            <div
              role="status"
              className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-7 text-paper motion-safe:animate-fade-up"
            >
              <CheckCircle2 size={44} aria-hidden="true" className="text-[#5fd08a]" />
              <h3 ref={successRef} tabIndex={-1} className="mt-4 font-display text-2xl font-semibold outline-none">
                {contact.success.title.replace('{name}', result.name)}
              </h3>
              <p className="mt-2 leading-7 text-paper/85">{contact.success.text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {result.whatsapp ? (
                  <a
                    href={result.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1f8f4e] px-5 font-noto text-sm font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
                  >
                    <WhatsAppIcon size={20} />
                    {contact.success.whatsapp}
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-11 items-center rounded-full border border-paper/50 px-5 font-noto text-sm font-bold text-paper transition hover:border-yellow hover:text-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
                >
                  {contact.success.again}
                </button>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              noValidate
              onSubmit={onSubmit}
              onChange={onChange}
              aria-busy={status === 'sending'}
              className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2"
            >
              <LineField
                label={fields.name}
                name="nombre"
                autoComplete="name"
                required
                error={errors.name}
                className="sm:col-span-2"
              />
              <LineField
                label={fields.email}
                name="correo"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                error={errors.email}
              />
              <LineField
                label={fields.phone}
                name="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                error={errors.phone}
              />
              <LineField
                label={fields.company}
                name="empresa"
                autoComplete="organization"
                className="sm:col-span-2"
              />

              <ChoiceGroup
                legend={fields.role}
                name="rol"
                type="radio"
                options={contact.roles}
                defaultValue={contact.roles[0]}
                className="sm:col-span-2"
              />
              <ChoiceGroup
                legend={fields.services}
                name="servicios"
                type="checkbox"
                options={contact.services}
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2">
                <div className="relative">
                  <textarea
                    id="contacto-mensaje"
                    name="mensaje"
                    required
                    rows={5}
                    maxLength={contact.maxMessage}
                    placeholder=" "
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby={`contacto-mensaje-count${errors.message ? ' contacto-mensaje-error' : ''}`}
                    className="peer block min-h-[160px] w-full resize-y rounded-xl border border-paper/45 bg-white/[0.03] px-4 pb-8 pt-8 text-base leading-6 text-paper outline-none transition-colors placeholder:text-transparent hover:border-paper/80 focus:border-blue-soft aria-[invalid=true]:border-[#ff9d9d]"
                  />
                  <label
                    htmlFor="contacto-mensaje"
                    className={`${floatingLabel} left-4 top-3 peer-placeholder-shown:top-4 peer-focus:top-3`}
                  >
                    {fields.message}
                    <span aria-hidden="true" className="text-yellow"> *</span>
                  </label>
                  <span
                    id="contacto-mensaje-count"
                    className="pointer-events-none absolute bottom-3 right-4 text-xs text-paper/70"
                  >
                    {messageLength}/{contact.maxMessage}
                    <span className="sr-only"> caracteres</span>
                  </span>
                </div>
                <FieldError id="contacto-mensaje-error">{errors.message}</FieldError>
              </div>

              <div className="sm:col-span-2">
                {file ? (
                  <div className="flex items-center gap-3 rounded-xl border border-paper/35 bg-white/5 px-4 py-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-action text-white">
                      <FileText size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-paper">{file.name}</span>
                      <span className="block text-xs text-paper/70">{formatSize(file.size)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label={`${attachment.remove}: ${file.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-paper transition hover:bg-white/10 hover:text-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
                <label
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`${file ? 'sr-only' : 'flex'} cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3.5 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-yellow hover:border-blue-soft ${dragging ? 'border-blue-soft bg-blue/10' : 'border-paper/40'}`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-action">
                    <img src={media.pdf} alt="" aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-paper">{attachment.label}</span>
                    <span className="block text-xs text-paper/70">{attachment.hint}</span>
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    name="requerimientos"
                    accept="application/pdf"
                    aria-invalid={errors.file ? 'true' : undefined}
                    aria-describedby={errors.file ? 'contacto-archivo-error' : undefined}
                    className="sr-only"
                    onChange={(event) => pickFile(event.target.files?.[0])}
                  />
                </label>
                <FieldError id="contacto-archivo-error">{errors.file}</FieldError>
              </div>

              <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-action px-7 font-noto text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(42,116,192,0.8)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow disabled:cursor-wait disabled:opacity-80 lg:h-[54px] lg:px-8"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={18} aria-hidden="true" className="motion-safe:animate-spin" />
                      {contact.sending}
                    </>
                  ) : (
                    <>
                      {contact.submit}
                      <Send
                        size={18}
                        aria-hidden="true"
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
                <p className="flex items-center gap-2 text-xs text-paper/70">
                  <Lock size={14} aria-hidden="true" />
                  {contact.privacy}
                </p>
              </div>
              {hasErrors ? (
                <p role="alert" className="-mt-3 text-sm text-[#ff9d9d] sm:col-span-2">
                  {contact.errors.summary}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
      <TricolorBar className="lg:w-[91.5%]" />
    </section>
  );
}
