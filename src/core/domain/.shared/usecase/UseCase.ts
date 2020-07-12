export interface UseCase<TInPort, TUseCaseResult> {
  execute(inPort?: TInPort): Promise<TUseCaseResult>;
}
