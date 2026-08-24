import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [signedUp, setSignedUp] = useState(false)

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <h3 className="text-lg font-bold">Don&apos;t miss a thing!</h3>
        <p className="mt-1 text-sm text-gray-600">Sign up for the newsletter and receive exclusive offers</p>
        {signedUp ? (
          <p className="mt-4 text-sm font-semibold">Thanks for signing up!</p>
        ) : (
          <form
            className="mt-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (email) setSignedUp(true)
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="rounded bg-gray-100 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black"
            />
            <button className="rounded bg-black py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
              Sign up
            </button>
          </form>
        )}
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-xs text-gray-600 sm:grid-cols-4">
          <div>
            <p className="mb-2 font-bold uppercase text-gray-900">Customer care</p>
            <p>Help &amp; Contact</p>
            <p>Delivery area</p>
            <p>Returns</p>
          </div>
          <div>
            <p className="mb-2 font-bold uppercase text-gray-900">Secure shopping</p>
            <p>Your data is secure with us</p>
            <p>Secure payments</p>
          </div>
          <div>
            <p className="mb-2 font-bold uppercase text-gray-900">About us</p>
            <p>Press</p>
            <p>Jobs</p>
          </div>
          <div>
            <p className="mb-2 font-bold uppercase text-gray-900">Legal</p>
            <p>Data privacy</p>
            <p>Terms of service</p>
            <p>Legal information</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
        © 2026 ABOUT YOU Clone — built for demo purposes
      </div>
    </footer>
  )
}
