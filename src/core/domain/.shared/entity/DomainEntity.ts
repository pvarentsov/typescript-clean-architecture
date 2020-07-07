export class DomainEntity<TIdentifier extends string|number> {
  
  protected _id: TIdentifier;
  
  public async validate(): Promise<void> {
    // TODO: Add implementation
    await Promise.resolve();
  }
  
}
