import type { Product } from "@/lib/api";

type ProductSpecsProps = {
  product: Product;
};

export function ProductSpecs({ product }: ProductSpecsProps) {
  const attributes =
    product.attributes && typeof product.attributes === "object"
      ? (product.attributes as Record<string, string>)
      : null;

  const entries = attributes ? Object.entries(attributes) : [];

  return (
    <section className="mt-8 rounded-sm bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium text-[var(--text-primary,#212121)]">
        Product Details
      </h2>

      {product.description && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase text-[var(--text-secondary,#878787)]">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-primary,#212121)]">
            {product.description}
          </p>
        </div>
      )}

      {entries.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-[var(--text-secondary,#878787)]">
            Specifications
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {entries.map(([key, value], index) => (
                <tr
                  key={key}
                  className={index % 2 === 0 ? "bg-[var(--surface,#f1f3f6)]" : "bg-white"}
                >
                  <td className="w-1/3 px-4 py-2.5 font-medium text-[var(--text-secondary,#878787)]">
                    {key}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text-primary,#212121)]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
