import React, { useState, useEffect, useCallback } from 'react';

interface PriceRange {
  min: number;
  max: number;
}

interface PriceRangeFilterProps {
  initialRange?: PriceRange;
  minPrice?: number;
  maxPrice?: number;
  step?: number;
  onChange?: (range: PriceRange) => void;
  className?: string;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  initialRange = { min: 0, max: 2000000 },
  minPrice = 0,
  maxPrice = 2000000,
  step = 10000,
  onChange,
  className = ''
}) => {
  const [range, setRange] = useState<PriceRange>(initialRange);
  const [tempRange, setTempRange] = useState<PriceRange>(initialRange);
  const [isSliding, setIsSliding] = useState(false);

  // 가격 형식화 함수
  const formatPrice = useCallback((price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}만`;
    } else if (price >= 10000) {
      return `${(price / 10000).toFixed(price % 10000 === 0 ? 0 : 1)}만`;
    }
    return new Intl.NumberFormat('ko-KR').format(price);
  }, []);

  // 미리 정의된 가격 범위들
  const presetRanges = [
    { label: '전체', min: minPrice, max: maxPrice },
    { label: '1만원 이하', min: minPrice, max: 10000 },
    { label: '1만 ~ 5만원', min: 10000, max: 50000 },
    { label: '5만 ~ 10만원', min: 50000, max: 100000 },
    { label: '10만 ~ 50만원', min: 100000, max: 500000 },
    { label: '50만원 이상', min: 500000, max: maxPrice },
  ];

  useEffect(() => {
    setRange(initialRange);
    setTempRange(initialRange);
  }, [initialRange]);

  const handleRangeChange = useCallback((newRange: PriceRange) => {
    if (!isSliding) {
      setRange(newRange);
      onChange?.(newRange);
    } else {
      setTempRange(newRange);
    }
  }, [isSliding, onChange]);

  const handleSliderChange = (type: 'min' | 'max', value: number) => {
    const newRange = {
      ...tempRange,
      [type]: value
    };

    // min이 max보다 크지 않도록 조정
    if (type === 'min' && value > tempRange.max) {
      newRange.max = value;
    } else if (type === 'max' && value < tempRange.min) {
      newRange.min = value;
    }

    setTempRange(newRange);
  };

  const handleSliderMouseDown = () => {
    setIsSliding(true);
  };

  const handleSliderMouseUp = () => {
    setIsSliding(false);
    setRange(tempRange);
    onChange?.(tempRange);
  };

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const clampedValue = Math.max(minPrice, Math.min(maxPrice, numValue));
    
    const newRange = {
      ...range,
      [type]: clampedValue
    };

    // min이 max보다 크지 않도록 조정
    if (type === 'min' && clampedValue > range.max) {
      newRange.max = clampedValue;
    } else if (type === 'max' && clampedValue < range.min) {
      newRange.min = clampedValue;
    }

    setRange(newRange);
    setTempRange(newRange);
    onChange?.(newRange);
  };

  const handlePresetClick = (preset: PriceRange) => {
    setRange(preset);
    setTempRange(preset);
    onChange?.(preset);
  };

  const currentRange = isSliding ? tempRange : range;
  const minPercent = ((currentRange.min - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((currentRange.max - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 미리 정의된 가격 범위 버튼들 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">빠른 선택</h4>
        <div className="grid grid-cols-2 gap-2">
          {presetRanges.map((preset, index) => {
            const isActive = range.min === preset.min && range.max === preset.max;
            return (
              <button
                key={index}
                onClick={() => handlePresetClick(preset)}
                className={`text-xs py-2 px-3 rounded-md border transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 가격 입력 필드 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">가격 범위</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">최소 가격</label>
            <div className="relative">
              <input
                type="text"
                value={currentRange.min.toLocaleString()}
                onChange={(e) => handleInputChange('min', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">원</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">최대 가격</label>
            <div className="relative">
              <input
                type="text"
                value={currentRange.max.toLocaleString()}
                onChange={(e) => handleInputChange('max', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={maxPrice.toLocaleString()}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 듀얼 슬라이더 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">슬라이더로 조정</h4>
        
        {/* 현재 선택된 범위 표시 */}
        <div className="text-center">
          <span className="text-sm text-gray-600">
            {formatPrice(currentRange.min)}원 ~ {formatPrice(currentRange.max)}원
          </span>
        </div>

        {/* 슬라이더 */}
        <div className="relative">
          {/* 슬라이더 트랙 */}
          <div className="relative h-2 bg-gray-200 rounded-full">
            {/* 선택된 범위 표시 */}
            <div
              className="absolute h-2 bg-blue-600 rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            />
          </div>

          {/* 최소값 슬라이더 */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={step}
            value={currentRange.min}
            onChange={(e) => handleSliderChange('min', parseInt(e.target.value))}
            onMouseDown={handleSliderMouseDown}
            onMouseUp={handleSliderMouseUp}
            onTouchStart={handleSliderMouseDown}
            onTouchEnd={handleSliderMouseUp}
            className="absolute top-0 -mt-1 w-full h-4 opacity-0 cursor-pointer"
          />

          {/* 최대값 슬라이더 */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={step}
            value={currentRange.max}
            onChange={(e) => handleSliderChange('max', parseInt(e.target.value))}
            onMouseDown={handleSliderMouseDown}
            onMouseUp={handleSliderMouseUp}
            onTouchStart={handleSliderMouseDown}
            onTouchEnd={handleSliderMouseUp}
            className="absolute top-0 -mt-1 w-full h-4 opacity-0 cursor-pointer"
          />

          {/* 슬라이더 핸들들 */}
          <div
            className="absolute w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md cursor-pointer -mt-1"
            style={{ left: `calc(${minPercent}% - 8px)` }}
          />
          <div
            className="absolute w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md cursor-pointer -mt-1"
            style={{ left: `calc(${maxPercent}% - 8px)` }}
          />
        </div>

        {/* 슬라이더 라벨 */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatPrice(minPrice)}원</span>
          <span>{formatPrice(maxPrice)}원</span>
        </div>
      </div>

      {/* 리셋 버튼 */}
      {(range.min !== minPrice || range.max !== maxPrice) && (
        <button
          onClick={() => handlePresetClick({ min: minPrice, max: maxPrice })}
          className="w-full text-sm text-gray-600 hover:text-blue-600 py-2 border border-gray-300 rounded-md hover:border-blue-300 transition-colors"
        >
          가격 필터 초기화
        </button>
      )}
    </div>
  );
};

export default PriceRangeFilter;
