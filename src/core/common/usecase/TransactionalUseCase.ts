import { UseCase } from '@core/common/usecase/UseCase';

export interface TransactionalUseCase<TUseCasePort, TUseCaseResult> extends UseCase<TUseCasePort, TUseCaseResult> {
  onCommit?: (result: TUseCaseResult, port: TUseCasePort) => Promise<void>;
  onRollback?: (error: Error, port: TUseCasePort) => Promise<void>
}

