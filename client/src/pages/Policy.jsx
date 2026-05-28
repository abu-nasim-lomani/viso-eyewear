import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'VISO Eyewear respects your privacy. This policy explains what we collect and how we use it.',
    sections: [
      ['Information we collect', 'Name, email, phone, and shipping address you provide at signup and checkout, plus order history and basic usage data.'],
      ['How we use it', 'To process and deliver orders, provide support, prevent fraud, and improve the store. We never sell your personal data.'],
      ['Payments', 'Online payments are handled by licensed gateways (bKash, Nagad, SSLCommerz). We do not store your card or wallet PIN.'],
      ['Data security', 'Passwords are hashed and access is restricted. We use HTTPS and industry-standard safeguards.'],
      ['Your rights', 'You may request access to or deletion of your data by contacting support@viso.com.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'By using VISO Eyewear you agree to the following terms.',
    sections: [
      ['Orders', 'An order is a request to buy. We may decline or cancel orders due to stock, pricing errors, or suspected fraud.'],
      ['Pricing', 'All prices are in Bangladeshi Taka (৳) and include applicable taxes unless stated otherwise.'],
      ['Payment', 'We accept Cash on Delivery and (where enabled) bKash, Nagad, and cards. COD orders must be paid in full on delivery.'],
      ['Product accuracy', '3D previews and colors are representative; slight variation from the physical product may occur.'],
      ['Liability', 'VISO is not liable for misuse of products. Warranty covers manufacturing defects only.'],
    ],
  },
  returns: {
    title: 'Returns & Refunds',
    intro: 'Not happy with your purchase? Here’s how returns work.',
    sections: [
      ['7-day returns', 'Request a return within 7 days of delivery if the item is unused, undamaged, and in original packaging.'],
      ['How to return', 'Contact support with your order number. We’ll arrange pickup or guide you to the nearest drop-off.'],
      ['Refunds', 'Once the item passes inspection, refunds are issued within 7–10 working days to your original payment method (or bKash/Nagad for COD).'],
      ['Non-returnable', 'Items damaged by misuse, or without original packaging, are not eligible.'],
      ['Warranty', 'Frames carry a 6-month warranty against manufacturing defects.'],
    ],
  },
}

export default function Policy({ doc }) {
  const data = DOCS[doc] || DOCS.privacy
  return (
    <div className="shell px-2 py-4 sm:px-4">
      <nav className="mb-3 flex items-center gap-1 px-1 text-xs text-muted">
        <Link to="/" className="hover:text-brand">Home</Link>
        <ChevronRight size={13} />
        <span className="text-ink-soft">{data.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-card sm:p-10">
        <h1 className="text-2xl font-extrabold text-ink">{data.title}</h1>
        <p className="mt-2 text-sm text-muted">{data.intro}</p>
        <p className="mt-1 text-xs text-faint">Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>

        <div className="mt-6 space-y-6">
          {data.sections.map(([h, body], i) => (
            <section key={i}>
              <h2 className="text-base font-bold text-ink">{i + 1}. {h}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 border-t border-line pt-5 text-sm text-muted">
          Questions? Email <span className="font-semibold text-brand">support@viso.com</span> or call 16XXX (10am–8pm).
        </p>
      </div>
    </div>
  )
}
