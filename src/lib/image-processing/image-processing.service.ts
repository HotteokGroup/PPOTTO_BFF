import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { ResizeImageOptions } from './image-processing.interface';

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
  async resize({ image, width, height }: ResizeImageOptions): Promise<Buffer> {
    return sharp(image).withMetadata().resize(width, height).toBuffer();
  }
}
