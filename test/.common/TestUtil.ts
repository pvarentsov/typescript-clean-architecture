export class TestUtil {
  
  public static filterObject(object: any, passFields: string[]): Record<string, unknown> {
    const filteredObject: Record<string, unknown> = {};
    
    for (const field of passFields) {
      filteredObject[field] = object[field]
    }
    
    return filteredObject;
  }
  
}