export interface UseCase<TInPort, TOutPort> {
  execute(inPort?: TInPort): Promise<TOutPort>;
}
