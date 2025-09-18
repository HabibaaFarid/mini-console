import Link from "next/link";
import { PaymentStatus, searchPayments } from "../lib/db";
import CopyButton from "../components/CopyButton";

type Props = {
  searchParams?: { q?: string; status?: string };
};

export default async function Page({ searchParams }: Props) {
  const q = searchParams?.q ?? "";
  const status = (["pending", "paid", "canceled"].includes(searchParams?.status ?? "")
    ? (searchParams?.status as PaymentStatus)
    : undefined);

  try {
    const payments = await searchPayments(q || undefined, status);

    return (
      <section>
        <h2>Payments</h2>

        {payments.length === 0 ? (
          <div className="empty">
            No payments found. Create one with the{" "}
            <Link href="/new">New Payment</Link> form.
          </div>
        ) : (
          <table className="payments-table" role="table">
            <thead>
              <tr>
                <th>System ID</th>
                <th>Your Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/payments/${p.id}`}>{p.id}</Link>
                  </td>
                  <td>{p.merchantOrderId}</td>
                  <td>
                    {(p.amount / 100).toFixed(2)} {p.currency}
                  </td>
                  <td>
                    <span className={`badge ${p.status}`}>{p.status}</span>
                  </td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td>
                    <a href={`/pay/${p.publicId}`}>/pay/{p.publicId}</a>{" "}
                    <CopyButton
                      text={`${
                        typeof window !== "undefined"
                          ? window.location.origin
                          : ""
                      }/pay/${p.publicId}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
