import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  className = ''
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleMainImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">📷</div>
          <div>이미지 없음</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* 메인 이미지 */}
      <div className="relative mb-4 group">
        <div 
          className={`relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transition-all duration-300 ${
            isZoomed ? 'transform scale-105' : ''
          }`}
          onClick={handleMainImageClick}
        >
          <img
            src={images[selectedImageIndex]}
            alt={`${productName} - 이미지 ${selectedImageIndex + 1}`}
            className="w-full h-96 md:h-[500px] object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* 확대/축소 아이콘 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
              {isZoomed ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* 이전/다음 버튼 (이미지가 2개 이상일 때만 표시) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* 이미지 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === selectedImageIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 썸네일 목록 */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === selectedImageIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - 썸네일 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* 선택된 썸네일 오버레이 */}
              {index === selectedImageIndex && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 확대된 이미지 모달 */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={images[selectedImageIndex]}
              alt={`${productName} - 확대 이미지`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 모달에서도 이전/다음 버튼 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
