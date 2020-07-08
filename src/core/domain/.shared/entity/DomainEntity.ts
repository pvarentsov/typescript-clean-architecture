export class DomainEntity<TIdentifier extends Optional<string|number>> {
  
  protected id: TIdentifier;
  
  public async validate(): Promise<void> {
    // TODO: Add implementation
    await Promise.resolve();
  }
  
}
