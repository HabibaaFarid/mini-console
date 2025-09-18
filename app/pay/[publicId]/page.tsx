import { getPaymentByPublicId } from "../../../lib/db";
import { markPaidAction, markCanceledAction } from "../../../actions/payments";
import Link from "next/link";

type Props = { params: { publicId: string } };

export default async function PayLink({ params }: Props) {
  try {
    const payment = await getPaymentByPublicId(params.publicId);
    if (!payment) {
      return (
        <section>
          <h2>Payment not found</h2>
          <p>No payment found for link {params.publicId}</p>
          <p>
            <Link href="/">Back to console</Link>
          </p>
        </section>
      );
    }

    return (
      <section>
        <h2>Pay — {payment.merchantOrderId}</h2>
        <p>
          Amount:{" "}
          <strong>
            {(payment.amount / 100).toFixed(2)} {payment.currency}
          </strong>
        </p>
        <p>
          Status:{" "}
          <span className={`badge ${payment.status}`}>{payment.status}</span>
        </p>

        {payment.status === "pending" ? (
          <div className="row">
            <form action={markPaidAction}>
              <input type="hidden" name="publicId" value={params.publicId} />
              <button type="submit" className="btn">
                Mark as Paid
              </button>
            </form>

            <form action={markCanceledAction}>
              <input type="hidden" name="publicId" value={params.publicId} />
              <button type="submit" className="btn outline">
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <div className="muted">
            This payment is <strong>{payment.status}</strong>.
          </div>
        )}

        <p>
          <Link href="/">Back to console</Link>
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
