export interface UseCase<TUseCasePort, TUseCaseResult> {
  execute(inPort?: TUseCasePort): Promise<TUseCaseResult>;
}
