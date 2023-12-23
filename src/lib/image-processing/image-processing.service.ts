import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import sharp from 'sharp';

import { ImageProcessingServiceResizeOptions } from './image-processing.interface';
import { ERROR_CODE } from '../exception/error.constant';

@Injectable()
export class ImageProcessingService {
  /**
   * 이미지를 WebP 형식으로 변환하여 리턴한다
   */
  async toWebp(image: Buffer): Promise<Buffer> {
    return sharp(image).withMetadata().webp({ lossless: true }).toBuffer();
  }

  /**
   * 이미지 리사이징
   */
  async resize({ image, width, height }: ImageProcessingServiceResizeOptions): Promise<Buffer> {
    return sharp(image).withMetadata().resize(width, height).toBuffer();
  }

  /**
   * 지원하는 이미지 형식인지 검증
   */
  isImage(file: Express.Multer.File): boolean {
    const supportedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/tiff',
      'image/heif', // HEIF 포맷
      'image/heic', // HEIC 포맷 (HEIF의 변형)
    ];
    return supportedMimeTypes.includes(file.mimetype);
  }

  /**
   * 이미지 리사이징 및 형식 변경
   */
  async processImage(
    file: Express.Multer.File,
    sizes: number[],
  ): Promise<{
    smallImage: Buffer;
    mediumImage: Buffer;
    largeImage: Buffer;
  }> {
    const originImage = file.buffer;

    const [smallImage, mediumImage, largeImage] = await Promise.allSettled(
      sizes.map(async (size) => {
        const resizedImage = await this.resize({ image: originImage, width: size });
        return this.toWebp(resizedImage);
      }),
    );

    if (smallImage.status === 'rejected' || mediumImage.status === 'rejected' || largeImage.status === 'rejected') {
      throw new UnprocessableEntityException(ERROR_CODE.IMAGE_PROCESSING_FAILED);
    }

    return {
      smallImage: smallImage.value,
      mediumImage: mediumImage.value,
      largeImage: largeImage.value,
    };
  }
}
