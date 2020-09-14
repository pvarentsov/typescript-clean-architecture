import { Readable } from 'stream';

export class TestUtil {
  
  public static filterObject(object: any, passFields: string[]): Record<string, unknown> {
    const filteredObject: Record<string, unknown> = {};
    
    for (const field of passFields) {
      filteredObject[field] = object[field]
    }
    
    return filteredObject;
  }
  
  public static createReadStream(buffer?: Buffer): Readable {
    const data: Buffer = buffer || Buffer.from('File');
    const readStream: Readable = new Readable();
    
    readStream.push(data);
    readStream.push(null);
    
    return readStream;
  }
  
}