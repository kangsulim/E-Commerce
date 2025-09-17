import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Modal,
  Backdrop,
  Grid2,
  useTheme,
  alpha
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Close as CloseIcon,
  CameraAlt as CameraIcon
} from '@mui/icons-material';

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
  const theme = useTheme();
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

  const handleCloseModal = () => {
    setIsZoomed(false);
  };

  if (!images || images.length === 0) {
    return (
      <Box
        className={className}
        sx={{
          bgcolor: 'grey.200',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1',
          color: 'text.disabled'
        }}
      >
        <Box textAlign="center">
          <CameraIcon sx={{ fontSize: 60, mb: 1 }} />
          <Box component="span" variant="body2">
            이미지 없음
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {/* 메인 이미지 */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box
          onClick={handleMainImageClick}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            bgcolor: 'grey.100',
            cursor: 'pointer',
            aspectRatio: '1',
            transition: 'transform 0.3s ease',
            '&:hover': {
              '& .hover-overlay': {
                opacity: 1
              },
              '& .main-image': {
                transform: 'scale(1.05)'
              }
            }
          }}
        >
          <Box
            component="img"
            className="main-image"
            src={images[selectedImageIndex]}
            alt={`${productName} - 이미지 ${selectedImageIndex + 1}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
          
          {/* 확대/축소 오버레이 */}
          <Box
            className="hover-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: alpha(theme.palette.common.black, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            <Box
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.9),
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ZoomInIcon sx={{ color: 'grey.700' }} />
            </Box>
          </Box>
        </Box>

        {/* 이전/다음 버튼 */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha(theme.palette.common.white, 0.8),
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  bgcolor: 'white'
                },
                '.hover-overlay:hover ~ &, &:hover': {
                  opacity: 1
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha(theme.palette.common.white, 0.8),
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  bgcolor: 'white'
                },
                '.hover-overlay:hover ~ &, &:hover': {
                  opacity: 1
                }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        {/* 이미지 인디케이터 */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleThumbnailClick(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === selectedImageIndex 
                    ? 'white' 
                    : alpha(theme.palette.common.white, 0.5),
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.75)
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* 썸네일 목록 */}
      {images.length > 1 && (
        <Grid2 container spacing={1}>
          {images.map((image, index) => (
            <Grid2 xs={3} key={index}>
              <Box
                onClick={() => handleThumbnailClick(index)}
                sx={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: 2,
                  borderColor: index === selectedImageIndex 
                    ? 'primary.main' 
                    : 'grey.300',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  '&:hover': {
                    borderColor: index === selectedImageIndex 
                      ? 'primary.main' 
                      : 'grey.400'
                  }
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`${productName} - 썸네일 ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* 선택된 썸네일 오버레이 */}
                {index === selectedImageIndex && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: alpha(theme.palette.primary.main, 0.2)
                    }}
                  />
                )}
              </Box>
            </Grid2>
          ))}
        </Grid2>
      )}

      {/* 확대된 이미지 모달 */}
      <Modal
        open={isZoomed}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { bgcolor: alpha(theme.palette.common.black, 0.8) }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none'
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={images[selectedImageIndex]}
              alt={`${productName} - 확대 이미지`}
              sx={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 1
              }}
            />
            
            {/* 닫기 버튼 */}
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: alpha(theme.palette.common.white, 0.8),
                '&:hover': {
                  bgcolor: 'white'
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* 모달에서도 이전/다음 버튼 */}
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: alpha(theme.palette.common.white, 0.8),
                    '&:hover': {
                      bgcolor: 'white'
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: alpha(theme.palette.common.white, 0.8),
                    '&:hover': {
                      bgcolor: 'white'
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductImageGallery;
