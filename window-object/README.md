# 🌐 Shopify Storefront Data Initialization

This JavaScript snippet sets up a **global `window.store` object** in Shopify, storing key data about the store, customer, cart, and default product images. It makes this information easily accessible for other scripts on the site, improving **performance** and **code organization**.

---

## 🔍 How It Works

1️⃣ **Creates the `window.store` Object**

- Stores key Shopify data that can be accessed in the console.
- Contains:
  - `template`: The **current page template**.
  - `cart`: The **current cart data**.
  - `customer`: The **logged-in customer data**.
  - `defaultProductImages`: Default **fallback images** for each brand.
  - `geoLocationBlocking`: A setting to enable or disable **content blocking** based on geolocation.

2️⃣ **Handles Product and Collection Pages**

- If the **template name contains "product"**, it loads additional **product JSON data** via the `'product-json'` snippet.
- If the **template name contains "collection"**, it loads **collection JSON data** via the `'collection-json'` snippet.

---

## 🛠 Code Implementation

```js
<script type="text/javascript">
  window.store = {
    template: {{ template | json }},
    cart: {{- cart | json -}},
    customer: {{- customer | json -}},
    defaultProductImages: {
      brand1: {{ settings.brand1_default_image | json }},
      brand2: {{ settings.brand2_default_image | json }},
      brand3: {{ settings.brand3_default_image | json }}
    },
    geoLocationBlocking: {{- settings.enable_visuals_blocking | json -}}
  };

  {%- if template.name contains 'product' -%}
    window.store.product = {%- render 'product-json' -%}
  {%- elsif template.name contains 'collection' -%}
    window.store.collection = {%- render 'collection-json' -%}
  {%- endif -%}
</script>
```

## 🎯 Why Use This?

### ✅ Makes Shopify Data Easily Accessible

Reduces the need for multiple Liquid queries by storing Shopify objects in JavaScript.

### ✅ Improves Performance

Allows front-end scripts to retrieve cart, customer, and product data without extra AJAX requests.

### ✅ Supports Dynamic Features

Enables product-specific and collection-specific functionality.

### ✅ Facilitates Customization

Provides default images for brands and handles geolocation-based content blocking.

### ✅ Improves Frontend Debugging

Developers can quickly access store information in browser.
