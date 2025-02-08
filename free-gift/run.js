// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/** Empty discount object when no eligible gifts are found */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.All,
  discounts: [],
};

/**
 * Main function that applies the free gift discount if conditions are met.
 * @param {RunInput} input - The input data from the Shopify cart
 * @returns {FunctionRunResult} - The result containing applicable discounts
 */
export function run(input) {
  const giftTargets = input.cart.lines
    .filter((line) => isGiftVariant(line))
    .map((line) => createTarget(line));

  const validTargets = filterEligibleTargets(input, giftTargets);

  if (!validTargets.length) {
    console.warn("No cart lines qualify for gift with purchase discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets: validTargets,
        value: {
          percentage: { value: "100.0" },
        },
        message: "Free gift with purchase",
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
  };
}

/**
 * Checks if a cart line item is a gift variant.
 * @param {any} line - The cart line item
 * @returns {boolean}
 */
function isGiftVariant(line) {
  return line.merchandise.__typename === "ProductVariant" && line.is_free_gift;
}

/**
 * Creates a discount target for a given cart line item.
 * @param {any} line - The cart line item
 * @returns {Target}
 */
function createTarget(line) {
  const variant = /** @type {ProductVariant} */ (line.merchandise);
  return {
    productVariant: {
      id: variant.id,
      quantity: 1,
    },
  };
}

/**
 * Extracts the numeric ProductVariant ID from Shopify's global ID format.
 * @param {string | undefined} id - The Shopify product variant ID
 * @returns {number | null}
 */
function extractId(id) {
  if (!id) return null;
  const match = id.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Filters valid gift targets based on cart conditions.
 * @param {RunInput} input - The input cart data
 * @param {Target[]} targets - The list of gift targets
 * @returns {Target[]} - The filtered eligible gift targets
 */
function filterEligibleTargets(input, targets) {
  const purchasedItems = input.cart.lines.filter((line) => !line.is_free_gift);

  return targets.filter((target) =>
    purchasedItems.some(
      (line) =>
        extractId(line.free_gift_id?.value) ===
        extractId(target.productVariant.id)
    )
  );
}
