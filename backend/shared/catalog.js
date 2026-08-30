import { PRODUCTS } from "./catalog-data.js";
import { HttpError } from "./http-error.js";

const BY_ID = new Map(PRODUCTS.map((product) => [product.id, product]));

export function getProduct(id) {
    return BY_ID.get(id) || null;
}

export function productCount() {
    return BY_ID.size;
}

/* Turns an untrusted cart from the browser into priced lines.
 *
 * Prices always come from PRODUCTS, never from the request, so editing the
 * page in devtools cannot change what is charged. */
export function validateCartItems(items, limits) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new HttpError(400, "Your cart is empty.");
    }
    if (items.length > limits.maxCartLines) {
        throw new HttpError(400, "Too many items in this checkout.");
    }

    return items.map((line) => {
        if (!line || typeof line !== "object") {
            throw new HttpError(400, "Invalid cart line.");
        }

        const product = getProduct(String(line.id || ""));
        if (!product) {
            throw new HttpError(400, "Unknown product in cart.");
        }

        const size = String(line.size || "");
        if (product.sizes.length && !product.sizes.includes(size)) {
            throw new HttpError(400, `${product.title} needs a valid size.`);
        }
        if (!product.sizes.length && size) {
            throw new HttpError(400, `${product.title} does not use sizes.`);
        }

        const qty = Number.parseInt(line.qty, 10);
        if (!Number.isInteger(qty) || qty < 1 || qty > limits.maxQtyPerLine) {
            throw new HttpError(400, `Invalid quantity for ${product.title}.`);
        }

        return { product, size, qty };
    });
}
