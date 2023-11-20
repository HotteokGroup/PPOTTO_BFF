import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { ResizeImageToWebpOptions } from './image-processing.interface';

@Injectable()
export class ImageProcessingService {
  /**
   * 이미지를 리사이징 후 webP 형식으로 변환하여 리턴한다
   */
  async resizeImageToWebp(params: ResizeImageToWebpOptions): Promise<Buffer> {
    const { image, width, height } = params;

    return sharp(image).withMetadata().resize(width, height).webp({ lossless: true }).toBuffer();
  }
}
