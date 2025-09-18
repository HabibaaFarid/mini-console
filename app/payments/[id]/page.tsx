import { getPaymentById } from "../../../lib/db";
import CopyButton from "../../../components/CopyButton";
import Link from "next/link";

type Props = {
  params: { id: string };
};

export default async function PaymentDetails({ params }: Props) {
  try {
    const payment = await getPaymentById(params.id);
    if (!payment) {
      return (
        <section>
          <h2>Payment not found</h2>
          <p>No payment found with id {params.id}</p>
          <p>
            <Link href="/">Back to list</Link>
          </p>
        </section>
      );
    }

    return (
      <section>
        <h2>Payment Details</h2>
        <dl className="details">
          <div>
            <dt>System ID</dt>
            <dd>{payment.id}</dd>
          </div>
          <div>
            <dt>Public Link</dt>
            <dd>
              <a href={`/pay/${payment.publicId}`}>/pay/{payment.publicId}</a>{" "}
              <CopyButton
                text={`${
                  typeof window !== "undefined" ? window.location.origin : ""
                }/pay/${payment.publicId}`}
              />
            </dd>
          </div>
          <div>
            <dt>Your Order ID</dt>
            <dd>{payment.merchantOrderId}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>
              {(payment.amount / 100).toFixed(2)} {payment.currency}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`badge ${payment.status}`}>
                {payment.status}
              </span>
            </dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{new Date(payment.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{new Date(payment.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>

        <h3>Activity</h3>
        <ul>
          <li>
            {new Date(payment.createdAt).toLocaleString()} — Created (pending)
          </li>
          {payment.updatedAt !== payment.createdAt && (
            <li>
              {new Date(payment.updatedAt).toLocaleString()} — Status changed to{" "}
              {payment.status}
            </li>
          )}
        </ul>

        <p>
          <Link href="/">← Back to list</Link>
        </p>
      </section>
    );
  } catch (err) {
    return (
      <div className="error">
        Failed to load payment. {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
