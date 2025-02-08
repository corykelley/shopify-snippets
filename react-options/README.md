# 🎨 React-Based Product Options Selector for Shopify

This **React component** powers the **product option selection area** on a Shopify **Product Description Page (PDP)**. It dynamically updates **variant selections**, **handles out-of-stock states**, and includes a **size chart feature**. Unlike a fully headless Shopify store, this solution works within a **Shopify theme** instead of Liquid, allowing for a more interactive experience.

---

## 🛠 Part of a Shopify PDP Buybox

This is a **React-based frontend solution** built to replace the traditional Liquid implementation of product options. It was developed as a **proof-of-concept for a client**, exploring React’s capabilities for handling **dynamic product selection** without going fully headless.

---

## 🔍 How It Works

### 1️⃣ **Manages Selected Product Options**

- Tracks selected options using **React state (`useState`)**.
- Updates selections dynamically via **Shopify’s global `window.state` object**.

### 2️⃣ **Detects Selected Variants**

- Listens for updates on `selectedVariant` using **`useEffect`**.
- Determines if the selected variant is **available or out of stock**.

### 3️⃣ **Handles Option Selection**

- Updates **selected options** when a user clicks on a variant.
- If a **color option** is selected, the page **scrolls to the top** to emphasize the change.

### 4️⃣ **Filters Unavailable Variants**

- Runs a **validation function (`checkAllOptions`)** to determine if a selection is out of stock.
- Applies **CSS classes** to visually indicate **out-of-stock options**.

### 5️⃣ **Displays a Dynamic Size Chart**

- Detects whether the product has **size options**.
- If a **size chart image** exists, a **"Size Chart" button** appears dynamically.

---

## 🛠 Code Implementation

```js
import React, { useState, useEffect } from "react";

import { addEffect } from "scripts/utils/Effects.js";
import { resizeImage } from "scripts/utils/Images.js";

const ProductOptions = () => {
  const { product } = window.eHS;
  const media = product.media;

  const [optionState, setOptionState] = useState(
    window.state.selectedProductOptions || []
  );
  const [selectedVariant, setSelectedVarient] = useState(
    window.state.selectedVariant || false
  );

  useEffect(addEffect("selectedProductOptions", setOptionState), []);
  useEffect(addEffect("selectedVariant", setSelectedVarient), []);

  const setSelectedOption = (optionGroup, option) => {
    const newOptionState = [...optionState];
    const optionIndex = optionGroup.position - 1;
    newOptionState[optionIndex] = option;
    window.setState("selectedProductOptions", newOptionState);

    // Take user back to top if they select a different color
    optionGroup.name == "Color" && window.scrollTo(0, 0);
  };

  const handleSizeChartPlacement = () => {
    const hasSizeOption = product.options.find(
      (optionGroup) => optionGroup.name != "Color"
    );

    return hasSizeOption;
  };

  const checkAllOptions = (option) => {
    let result = "available";

    product.variants.forEach((variant) => {
      // Check for the first option
      if (
        optionState[0] !== option &&
        variant.options.includes(optionState[0]) &&
        variant.options.includes(option) &&
        !variant.available
      ) {
        result = " option--oos";
      }

      // Check for the second option
      else if (
        optionState[1] !== option &&
        variant.options.includes(optionState[1]) &&
        variant.options.includes(option) &&
        !variant.available
      ) {
        result = " option--oos";
      }
    });

    return result;
  };

  return (
    <>
      <div className="mt-4 mb-8">
        {product.options.map((optionGroup, groupIndex) => (
          <div className="mb-8" key={`option-group-${groupIndex}`}>
            {optionGroup.name != "Color" ? (
              <div
                className={`${
                  product.sizeChartImage && "flex flex-row justify-between"
                }`}
              >
                <p className="flex items-center mb-2 font-semibold sub-xs caps text-grey-800">
                  {optionGroup.name}
                  <span className="sub-xs caps !font-normal text-grey-800 ml-1">
                    {optionState[optionGroup.position - 1]}
                  </span>
                </p>
                {product.sizeChartImage && handleSizeChartPlacement() && (
                  <p className="mb-2 font-semibold cursor-pointer size-chart-link sub-xs caps text-grey-800">
                    Size Chart
                  </p>
                )}
              </div>
            ) : (
              <p className="flex items-center mb-2 font-semibold sub-xs caps text-grey-800">
                {optionGroup.name}
                <span className="sub-xs caps !font-normal text-grey-800 ml-1">
                  {optionState[optionGroup.position - 1]}
                </span>
              </p>
            )}
            {optionGroup.name !== "Color" && (
              <div className="flex flex-row flex-wrap gap-[6px]">
                {optionGroup.values.map((option, optionIndex) => (
                  <button
                    className={`w-[60px] lg:w-[90px] bg-off-white py-2 transition-all ease-in-out duration-100 border-[2px] border-off-white ${
                      optionState.includes(option)
                        ? "!border-black !border-[2px]"
                        : "hover:!border-grey-300 hover:!border"
                    } ${
                      selectedVariant
                        ? selectedVariant.options.includes(option) &&
                          !selectedVariant.available &&
                          "option--oos"
                        : optionState.includes(option) && "option--oos"
                    } ${checkAllOptions(option)}`}
                    key={`variant-option-${option}-${optionIndex}`}
                    onClick={() => setSelectedOption(optionGroup, option)}
                  >
                    <span
                      className={`bg-off-white p-[2px] ${
                        optionState.includes(option) && "!font-semibold"
                      }`}
                    >
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {!handleSizeChartPlacement() && (
        <p className="mb-4 font-semibold cursor-pointer size-chart-link sub-xs caps text-grey-800 lg:mb-6 w-fit">
          Size Chart
        </p>
      )}
    </>
  );
};

export default ProductOptions;
```

## 🎯 Why Use This?

### ✅ Reduces Shopify Liquid Complexity

Replaces Liquid-based option handling with a React-based solution, making the code more maintainable and easier to extend. Great for those new to liquid, but experienced in React.

### ✅ Enhances Shopify PDP with React

Provides a modern, interactive UX without requiring a fully headless implementation.

### ✅ Dynamically Updates Variant Selection

Automatically updates selected options and out-of-stock statuses based on user interaction.

### ✅ Potential Optimization for Performance

Minimizes re-renders and relies on Shopify’s global state (window.state) for efficient updates.
