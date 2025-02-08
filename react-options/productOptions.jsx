import React, { useState, useEffect } from "react";
import { addEffect } from "scripts/utils/Effects.js";
import { resizeImage } from "scripts/utils/Images.js";

const ProductOptions = () => {
  const { product } = window.eHS;
  const media = product.media;

  const [selectedOptions, setSelectedOptions] = useState(
    window.state.selectedProductOptions || []
  );
  const [selectedVariant, setSelectedVariant] = useState(
    window.state.selectedVariant || null
  );

  useEffect(() => addEffect("selectedProductOptions", setSelectedOptions), []);
  useEffect(() => addEffect("selectedVariant", setSelectedVariant), []);

  const handleOptionSelect = (optionGroup, option) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[optionGroup.position - 1] = option;
    window.setState("selectedProductOptions", updatedOptions);

    if (optionGroup.name === "Color") window.scrollTo(0, 0);
  };

  const hasSizeOption = product.options.some(
    (option) => option.name !== "Color"
  );

  const checkAvailability = (option) => {
    return product.variants.some(
      (variant) =>
        variant.options.includes(option) &&
        variant.options.includes(selectedOptions[0]) &&
        !variant.available
    )
      ? "option--oos"
      : "available";
  };

  return (
    <div className="mt-4 mb-8">
      {product.options.map((optionGroup, groupIndex) => (
        <div className="mb-8" key={groupIndex}>
          <div className="flex justify-between items-center mb-2 font-semibold sub-xs caps text-grey-800">
            <span>
              {optionGroup.name}: {selectedOptions[optionGroup.position - 1]}
            </span>
            {product.sizeChartImage &&
              hasSizeOption &&
              optionGroup.name !== "Color" && (
                <p className="cursor-pointer size-chart-link">Size Chart</p>
              )}
          </div>

          {optionGroup.name !== "Color" ? (
            <div className="flex flex-wrap gap-2">
              {optionGroup.values.map((option, index) => (
                <button
                  key={index}
                  className={`w-[60px] lg:w-[90px] py-2 border-2 transition-all ${
                    selectedOptions.includes(option)
                      ? "border-black"
                      : "border-off-white hover:border-grey-300"
                  } ${checkAvailability(option)}`}
                  onClick={() => handleOptionSelect(optionGroup, option)}
                >
                  <span
                    className={
                      selectedOptions.includes(option) ? "font-semibold" : ""
                    }
                  >
                    {option}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden mb-4 lg:overflow-visible">
              <div className="flex gap-2 lg:flex-wrap overflow-x-scroll lg:overflow-hidden">
                {optionGroup.values.map(
                  (option, index) =>
                    media.some(
                      (img) => img.associated_color === option.toLowerCase()
                    ) && (
                      <div
                        key={index}
                        className={`color-option h-16 w-16 cursor-pointer border transition-all ${
                          selectedOptions.includes(option)
                            ? "border-black"
                            : "border-grey-100 hover:border-grey-300"
                        } ${checkAvailability(option)}`}
                        onClick={() => handleOptionSelect(optionGroup, option)}
                      >
                        <img
                          loading="lazy"
                          className="object-cover"
                          width="70"
                          height="70"
                          src={resizeImage(
                            media.find(
                              (img) =>
                                img.associated_color === option.toLowerCase()
                            ).variant_image,
                            "x100"
                          )}
                          alt={option}
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {!hasSizeOption && (
        <p className="mb-4 font-semibold cursor-pointer size-chart-link">
          Size Chart
        </p>
      )}
    </div>
  );
};

export default ProductOptions;
