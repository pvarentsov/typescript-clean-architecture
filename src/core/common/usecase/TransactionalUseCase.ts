import { UseCase } from '@core/common/usecase/UseCase';

export interface TransactionalUseCase<TUseCasePort, TUseCaseResult> extends UseCase<TUseCasePort, TUseCaseResult> {
  onCommit(result?: TUseCaseResult): Promise<void>;
  onRollback(error?: Error): Promise<void>
}

