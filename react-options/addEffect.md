# 🔄 `addEffect` – A React State Synchronization Utility

This utility function, **`addEffect`**, is designed to **synchronize React state with Shopify’s global `window.state` object**. It listens for changes in a specific **state item** within `window.state` and updates the corresponding React state whenever that item changes.

---

## 🔍 How It Works

### 1️⃣ **Listens for State Changes in Shopify’s `window.state`**

- Uses `window.listenToState()` to track changes to a **specific state item**.
- When the value of `stateItem` changes, it:
  - Updates the React state by calling `stateSetter(newStateValue)`.
  - Optionally triggers a callback function if provided.

### 2️⃣ **Handles Cleanup to Prevent Memory Leaks**

- Returns a cleanup function that **aborts the event listener** when the component unmounts.

---

## 🛠 Code Implementation

```javascript
export const addEffect = (stateItem, stateSetter, callback = false) => {
  return () => {
    const controller = window.listenToState((newStateValue) => {
      stateSetter(newStateValue);
      if (callback !== false) callback(newStateValue);
    }, stateItem);
    return () => controller.abort();
  };
};
```

## 🚀 How addEffect is Used in ProductOptions.jsx

The ProductOptions component (discussed previously) relies on addEffect to synchronize selected product options and variants with Shopify’s global state. Here’s how:

### ✅ Keeps React State in Sync with Shopify State

`addEffect("selectedProductOptions", setOptionState)`
Updates the optionState whenever `selectedProductOptions` changes in `window.state`.
`addEffect("selectedVariant", setSelectedVarient)`
updates `selectedVariant` when `selectedVariant` changes in `window.state`.

### ✅ Prevents Memory Leaks

The returned cleanup function removes event listeners when the component unmounts, preventing unnecessary state updates.
