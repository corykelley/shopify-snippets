# 📏 Dynamic Spacer for Shopify Sections

This Liquid snippet dynamically controls the **bottom margin spacing** of sections in Shopify, adjusting for **mobile and desktop screen sizes**. By using this spacer, you can fine-tune the layout without hardcoding margins, making the design more flexible and responsive.

---

## 🔍 How It Works

1️⃣ **Accepts Two Required Parameters**

- `_mobile_space`: Defines the space (in pixels) beneath the section on **mobile** devices.
- `_desktop_space`: Defines the space (in pixels) beneath the section on **desktop** screens.

2️⃣ **Implements Conditional Visibility**

- Uses Tailwind CSS classes:
  - `lg:hidden`: Hides the mobile spacer on large screens.
  - `hidden lg:block`: Hides the desktop spacer on small screens.

3️⃣ **Applies Dynamic Margins**

- Uses inline styles to set the **bottom margin** dynamically for each screen size.

---

## 🛠 Code Implementation

```liquid
{%- comment -%}
  Required:
  _mobile_space: the space in pixels to go beneath the section on mobile sizes
  _desktop_space: the space in pixels to go beneath the section on desktops
{%- endcomment -%}

<div class="lg:hidden" style="margin-bottom: {{ _mobile_space }}px"></div>
<div class="hidden lg:block" style="margin-bottom: {{ _desktop_space }}px"></div>
```

## 🎯 Sample Usage

This example calls the spacer snippet while passing in values from section settings:

```liquid
{%- render 'spacer', _mobile_space: section.settings.bottom_margin_mobile, _desktop_space: section.settings.bottom_margin_desktop -%}
```

## 🛠 Sample Schema for Theme Customization

This schema adds a spacing controls to the Shopify theme editor, allowing merchants to adjust margins using a slider.

```liquid
{
  "type": "header",
  "content": "Spacing"
},
{
  "id": "bottom_margin_mobile",
  "label": "Bottom Margin - Mobile",
  "type": "range",
  "min": 0,
  "max": 200,
  "step": 2,
  "default": 40
},
{
  "id": "bottom_margin_desktop",
  "label": "Bottom Margin - Desktop",
  "type": "range",
  "min": 0,
  "max": 200,
  "step": 2,
  "default": 70
}
```

## 🚀 Why Use This?

### ✅ Improves Design Flexibility

Adjusts spacing dynamically without modifying code.

### ✅ Enhances Responsiveness

Uses different spacing values for mobile and desktop.

### ✅ Easy to Customize

Merchants can adjust values via Shopify’s theme editor.
