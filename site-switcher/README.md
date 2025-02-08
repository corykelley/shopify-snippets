# 🏷️ Dynamic Brand Variable Assignment in Shopify

This Liquid script is responsible for dynamically determining **brand-related variables** in Shopify. It selects a brand based on the **template suffix** of the current page and optionally outputs the brand handle if needed. This is useful for multi-brand stores that require different configurations based on the page context.

---

## 🔍 How It Works

### 1️⃣ **Determine the Brand Suffix**

- The script checks if the **current page has a template suffix** and assigns it to `brand_suffix`.
- It looks for suffixes in the following order:
  - `page.template_suffix`
  - `product.template_suffix`
  - `collection.template_suffix`
  - `blog.template_suffix`
- If none are found, it defaults to `'brand1'`.

### 2️⃣ **Assign the Brand Handle & URL**

Based on the value of `brand_suffix`, the script assigns:

- `brandHandle`: Represents the brand identifier (e.g., `brand1`, `brand2`, `brand3`, or `brand4`).
- `mainURL`: Constructs a relative URL using the brand handle (`/pages/brand1`, `/pages/brand2`, etc.).
- If no valid match is found, the script defaults to:
  - `brandHandle = 'brand1'`
  - `mainURL = '/'`

### 3️⃣ **Optional Output of Brand Handle**

- If `print_handle` is set to `true`, the script **outputs the brand handle**.
  This is useful when rendering this snippet inside another section,
  allowing dynamic styling or functionality based on the brand variable.

---

## 🛠 Code Implementation

```liquid
{%- comment -%}
  Outputs brand variables dynamically or manually
  -----------------------------------------------
  Usage:
  {%- render 'site-switcher'
  - brand_suffix: { string } optional | Use brand1, brand2, or brand3 for manual input. Leave blank for dynamic input (based on
  template suffix of current page)
  - print_handle: { boolean } optional | defaults to false, set to true to output the brand handle
  -%}

  Example:
  {%- render 'site-switcher' with brand_suffix: brand3, print_handle: true -%}
{%- endcomment -%}

{% liquid
  if page.template_suffix
    assign brand_suffix = page.template_suffix
  elsif product.template_suffix
    assign brand_suffix = product.template_suffix
  elsif collection.template_suffix
    assign brand_suffix = collection.template_suffix
  elsif blog.template_suffix
    assign brand_suffix = blog.template_suffix
  else
    assign brand_suffix = 'brand1'
  endif

  if brand_suffix contains 'brand1'
    assign brandHandle = 'brand1'
    assign mainURL = brandHandle | prepend: '/pages/'
  elsif brand_suffix contains 'brand2'
    assign brandHandle = 'brand2'
    assign mainURL = brandHandle | prepend: '/pages/'
  elsif brand_suffix contains 'brand3'
    assign brandHandle = 'brand3'
    assign mainURL = brandHandle | prepend: '/pages/'
  elsif brand_suffix contains 'brand4'
    assign brandHandle = 'brand4'
    assign mainURL = brandHandle | prepend: '/pages/'
  else
    assign brandHandle = 'brand1'
    assign mainURL = '/'
  endif
%}

{% if print_handle == true %}
  {{ brandHandle | strip }}
{% endif %}
```

## 🎯 Why This Matters

### ✅ Flexible Branding

Dynamically assigns brands based on the current page type.

### ✅ Reduces Manual Work

No need to manually assign brands for each page.

### ✅ Supports Multi-Brand Stores

Easily integrates with brand-specific pages (brand1, brand2, brand3).

### ✅ Customizable Output

Allows optional brand handle output using print_handle.
