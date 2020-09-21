import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { UseCase } from '@core/common/usecase/UseCase';
import { runOnTransactionCommit, runOnTransactionRollback, Transactional } from 'typeorm-transactional-cls-hooked';

export class TransactionalUseCaseWrapper<TUseCasePort, TUseCaseResult> implements UseCase<TUseCasePort, TUseCaseResult> {
  
  constructor(
    private readonly useCase: TransactionalUseCase<TUseCasePort, TUseCaseResult>,
  ) {}
  
  @Transactional()
  public async execute(port: TUseCasePort): Promise<TUseCaseResult> {
    runOnTransactionRollback(async (error: Error) => this.useCase.onRollback?.(error, port));
    
    const result: TUseCaseResult = await this.useCase.execute(port);
    runOnTransactionCommit(async () => this.useCase.onCommit?.(result, port));
    
    return result;
  }
  
}