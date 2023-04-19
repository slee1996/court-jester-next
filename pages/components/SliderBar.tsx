import React, { useState, ChangeEvent } from "react";

interface SliderBarProps {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const SliderBar: React.FC<SliderBarProps> = ({
  min = 1,
  max = 10,
  value = 1,
  onChange = () => {},
}) => {
  const [sliderValue, setSliderValue] = useState<number>(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    onChange(newValue);
  };

  const thumbPosition = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div className='relative w-full'>
      <span>Number of Responses to Generate</span>
      <input
        id='sliderRange'
        type='range'
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleChange}
        className='w-full h-1.5 bg-gradient-to-r from-blue-500 to-gray-300 rounded-full appearance-none cursor-pointer focus:outline-none transition-all duration-300 ease-in-out'
        style={{
          backgroundImage: `-webkit-linear-gradient(left, #3B82F6 ${thumbPosition}%, #E5E7EB 0%)`,
        }}
      />
      {sliderValue !== 1 && sliderValue !== 10 && (
        <span
          className='absolute text-xs text-white'
          style={{
            left: `calc(${thumbPosition}%)`,
            bottom: "0rem",
          }}
        >
          {sliderValue}
        </span>
      )}
      <div className='flex justify-between text-sm mt-6'>
        <span className={sliderValue === min ? "text-white" : "text-gray-600"}>
          {min}
        </span>
        <span className={sliderValue === max ? "text-white" : "text-gray-600"}>
          {max}
        </span>
      </div>
    </div>
  );
};

export default SliderBar;
