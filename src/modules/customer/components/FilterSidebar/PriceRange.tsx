import React, { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";

interface PriceRangeProps {
  min: number;
  max: number;
  onApply: (min: number, max: number) => void;
}

const PriceRange: React.FC<PriceRangeProps> = ({ min, max, onApply }) => {
  // slider’s current [low, high] bounds
  const [domain, setDomain] = useState<[number, number]>([min, max]);
  // slider thumbs
  const [values, setValues] = useState<[number, number]>([min, max]);
  // raw text inputs
  const [rawLow, setRawLow] = useState(min.toString());
  const [rawHigh, setRawHigh] = useState(max.toString());
  // validation error
  const [error, setError] = useState("");

  // reset whenever props.min/max change
  useEffect(() => {
    setDomain([min, max]);
    setValues([min, max]);
    setRawLow(min.toString());
    setRawHigh(max.toString());
    setError("");
  }, [min, max]);

  // dragging updates both slider & inputs
  const onSliderChange = (values: number[]) => {
    const [low, high] = values;
    setValues([low, high]);
    setRawLow(low.toString());
    setRawHigh(high.toString());
    setError("");
  };

  // typing handlers: only digits, up to 10 chars
  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d{0,10}$/.test(e.target.value)) {
      setRawLow(e.target.value);
      setError("");
    }
  };
  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d{0,10}$/.test(e.target.value)) {
      setRawHigh(e.target.value);
      setError("");
    }
  };

  // on blur: validate & commit manual values
  const commitManual = () => {
    if (!/^\d{1,10}$/.test(rawLow) || !/^\d{1,10}$/.test(rawHigh)) {
      setError("Enter 1–10 digits in both fields");
      return;
    }
    let lowNum = Number(rawLow);
    let highNum = Number(rawHigh);
    // sort so low ≤ high
    if (lowNum > highNum) [lowNum, highNum] = [highNum, lowNum];
    // update slider domain & thumbs
    setDomain([lowNum, highNum]);
    setValues([lowNum, highNum]);
    setRawLow(lowNum.toString());
    setRawHigh(highNum.toString());
    setError("");
  };

  const canApply = error === "" && rawLow !== "" && rawHigh !== "";

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Price Range</h3>

      {/* Slider */}
      <div className="px-2">
        <Range
          values={values}
          step={1}
          min={domain[0]}
          max={domain[1]}
          onChange={onSliderChange}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              className="w-full h-2 flex items-center"
            >
              <div
                ref={props.ref}
                className="w-full h-2 rounded-full"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#e5e7eb", "#ef4444", "#e5e7eb"],
                    min: domain[0],
                    max: domain[1],
                  }),
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div
              {...props}
              className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <span className="text-xs text-white select-none">
                {values[index]}
              </span>
            </div>
          )}
        />
      </div>

      {/* Inputs + Apply */}
      <div className="flex items-center space-x-3 mt-4">
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Min</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={rawLow}
            onChange={handleLowChange}
            onBlur={commitManual}
            placeholder={min.toString()}
            className={`w-24 border rounded px-2 py-1 text-sm ${
              error ? "border-red-500" : ""
            }`}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Max</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={rawHigh}
            onChange={handleHighChange}
            onBlur={commitManual}
            placeholder={max.toString()}
            className={`w-24 border rounded px-2 py-1 text-sm ${
              error ? "border-red-500" : ""
            }`}
          />
        </div>
        <button
          onClick={() => onApply(values[0], values[1])}
          disabled={!canApply}
          className="ml-auto bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Apply
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PriceRange;
