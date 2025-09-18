import { createPaymentAction } from "../../actions/payments";

export default function NewPaymentPage() {
  return (
    <section>
      <h2>Create New Payment</h2>

      <form
        action={createPaymentAction}
        className="stack"
        aria-label="Create payment form"
      >
        <label>
          Amount (example: 10.50)
          <input
            name="amount"
            type="text"
            placeholder="10.00"
            required
            aria-required="true"
          />
        </label>

        <label>
          Currency
          <select name="currency" defaultValue="EGP" disabled>
            <option value="EGP">EGP</option>
          </select>
        </label>

        <label>
          Your Order ID (merchantOrderId)
          <input
            name="merchantOrderId"
            type="text"
            placeholder="ORDER-1234"
            required
          />
        </label>

        <div className="row">
          <button type="submit" className="btn">
            Create Payment
          </button>
          {/*eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="btn outline" href="/">
            Cancel
          </a>
        </div>
      </form>
    </section>
  );
}
