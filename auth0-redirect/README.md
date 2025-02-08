# Shopify Login Redirect to Auth0

This script is designed to detect when a user visits the Shopify login page and seamlessly redirect them to an **Auth0 authentication URL**. Since this code was used on a multi-brand, multi-market store, it ensures that users are returned to the correct page after authentication while preserving locale settings.

---

## 🔍 How It Works

1. **Extract Query Parameters**

   - The script retrieves any URL parameters, particularly looking for `checkout_url`.

2. **Determine Previous URL**

   - If `checkout_url` is present, it is used as the `previousUrl`.
   - If not, the script falls back to `document.referrer` (the last visited page).
   - If the `checkout_url` does not contain the shop’s base URL, it prepends it.

3. **Handle Locale Settings**

   - The store's locale is extracted from `Shopify.routes.root`.
   - Any slashes (`/`) are removed to format it properly.
   - If available, it is appended as a `ui_locales` parameter.

4. **Build and Redirect to Auth0 URL**
   - The script constructs the **Auth0 login URL** using:
     - The **returnTo** parameter (previous URL)
     - The **locale parameter** (if applicable)
   - Finally, the user is redirected to **Auth0 for authentication**.

---

## 🛠 Code Implementation

```html
<script>
  const searchParams = new URLSearchParams(window.location.search);
  let locale = Shopify.routes.root;
  let localeParam;
  let previousUrl = document.referrer;

  if (locale) {
    localeParam = `&ui_locales=${locale.replaceAll("\\/", "")}`;
  }

  if (searchParams.has("checkout_url")) {
    previousUrl = searchParams.get("checkout_url");

    if (!previousUrl.includes("{{ shop.url }}")) {
      previousUrl = "{{ shop.url }}" + previousUrl;
    }
  }

  window.location.href =
    "{{ settings.auth0_login_url }}&returnTo=" +
    encodeURIComponent(previousUrl) +
    (localeParam ? localeParam : "");
</script>
```

## 🎯 Why This Matters

### Seamless User Experience 🌟

Redirects users smoothly from Shopify’s login page to Auth0 without manual intervention.

### Preserves Return URL 🔄

Ensures users return to the correct page post-login.

### Supports Localization 🌍

Passes the user's locale for a region-specific authentication experience.
