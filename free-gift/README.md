# 🎁 Free Gift Discount Logic for Shopify Extensions (`run.js`)

This `run.js` file is part of a **Shopify extension** that automatically applies a **free gift discount** when specific conditions are met. It determines if a customer qualifies for a **"Gift with Purchase"** promotion and ensures eligible gift items receive a **100% discount**.

---

## 🛠 Part of a Larger Shopify Extension

This file is used within a **Shopify Function Extension** to handle discount logic dynamically.

- **`run.js`**: Defines the logic to check eligibility and apply discounts.
- **Other files** (not shown): Handle setup, function registration, and additional Shopify API interactions.

---

## 🔍 How It Works

1️⃣ **Identifies Gift Variants in the Cart**

- Filters cart items to find products marked as `is_free_gift`.

2️⃣ **Creates Discount Targets**

- Extracts product variant IDs to define which items should receive the discount.

3️⃣ **Validates Eligibility**

- Ensures that a **qualifying purchase** exists in the cart before applying the discount.

4️⃣ **Applies a 100% Discount**

- If conditions are met, the function returns a **discount object** that Shopify uses to apply the free gift.

---

## 🛠 Code Implementation

```js
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
```

## 🎯 Why Use This?

### ✅ Automates Free Gift Promotions

Dynamically applies **100% discounts** to **gift products** when a customer qualifies, ensuring a seamless checkout experience.

### ✅ Reduces Manual Work

No need to manually adjust cart discounts—**Shopify Functions** handle the logic automatically, saving time and preventing errors.

### ✅ Custom Solution for Client

Designed to **match specific business rules**, allowing for **flexible promotional strategies** tailored to client needs.
