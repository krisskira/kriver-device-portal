import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { media } from '../assets/media';
import { TricolorBar } from './ui';

const line =
  'block w-full border-0 border-b border-paper bg-transparent pb-3 text-sm leading-[19px] text-paper outline-none transition placeholder:text-paper focus:border-blue md:text-base';

function LineField({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="sr-only">{label}</span>
      <input {...props} placeholder={label} className={line} />
    </label>
  );
}

export function ContactSection({ contact }) {
  const [sent, setSent] = useState(false);
  const [file, setFile] = useState('');
  const { fields } = contact;

  function onSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

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
      <div className="relative bg-panel lg:h-[916px] lg:w-[91.5%] rounded-tr-[20px] lg:rounded-tr-[60px]">
        <img
          src={media.contact}
          alt="Persona trabajando en su portátil junto a una ventana"
          loading="lazy"
          className="absolute inset-y-0 left-0 hidden h-full w-[53.2%] object-cover [clip-path:polygon(0_0,100%_0,86.7%_100%,0_100%)] lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-[53.2%] bg-[rgba(37,37,37,0.24)] [clip-path:polygon(0_0,100%_0,86.7%_100%,0_100%)] lg:block"
        />
        <div className="relative px-4 pb-[62px] pt-[46px] lg:absolute lg:left-[55.4%] lg:top-8 lg:w-[37.4%] lg:p-0">
          <h2
            id="contacto-title"
            className="text-center font-display text-2xl font-bold leading-9 text-white lg:text-[36px] lg:leading-[54px]"
          >
            {contact.title}
          </h2>

          {sent ? (
            <p role="status" className="mt-[82px] rounded-xl border border-paper p-6 text-lg text-paper lg:mt-[66px]">
              {contact.success}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-[82px] grid grid-cols-2 gap-x-[14px] lg:mt-[66px] lg:gap-x-[55px]">
              <LineField label={fields.name} name="nombre" autoComplete="name" required className="col-span-2" />
              <LineField label={fields.company} name="empresa" autoComplete="organization" className="mt-[49px]" />
              <LineField
                label={fields.email}
                name="correo"
                type="email"
                autoComplete="email"
                required
                className="mt-[49px]"
              />
              <label className="relative mt-[35px] block">
                <span className="block text-xs leading-[14px] text-blue-soft">{fields.role}</span>
                <select
                  name="rol"
                  defaultValue={contact.roles[0]}
                  className={`${line} mt-3 cursor-pointer appearance-none pr-6 [&>option]:text-ink`}
                >
                  {contact.roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
                <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute bottom-3.5 right-0 text-paper" />
              </label>
              <LineField
                label={fields.phone}
                name="telefono"
                type="tel"
                autoComplete="tel"
                required
                className="mt-[35px] self-end"
              />

              <label className="col-span-2 mt-9 flex h-16 w-[231px] cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-action font-display text-base font-semibold text-white transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-yellow hover:brightness-95 lg:w-[268px]">
                <span className="max-w-[180px] truncate">{file || contact.attachment}</span>
                <img src={media.pdf} alt="" aria-hidden="true" className="h-6 w-6" />
                <input
                  type="file"
                  name="requerimientos"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(event) => setFile(event.target.files?.[0]?.name || '')}
                />
              </label>

              <label className="col-span-2 mt-9 block">
                <span className="sr-only">{fields.message}</span>
                <textarea
                  name="mensaje"
                  required
                  placeholder={fields.message}
                  className="block h-[186px] w-full resize-none rounded-xl border border-paper bg-transparent p-3.5 text-sm text-paper outline-none placeholder:text-paper focus:border-blue md:text-base"
                />
              </label>

              <div className="col-span-2 mt-[34px]">
                <button
                  type="submit"
                  className="h-10 w-[115px] rounded-[27px] bg-action font-noto text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow lg:h-[54px] lg:w-[181px] lg:text-base"
                >
                  {contact.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <TricolorBar className="lg:w-[91.5%]" />
    </section>
  );
}
