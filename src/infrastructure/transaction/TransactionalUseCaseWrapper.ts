import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { UseCase } from '@core/common/usecase/UseCase';
import { runOnTransactionCommit, runOnTransactionRollback, Transactional } from 'typeorm-transactional-cls-hooked';

export class TransactionalUseCaseWrapper implements UseCase<unknown, unknown> {
  
  constructor(
    private readonly useCase: TransactionalUseCase<unknown, unknown>,
  ) {}
  
  @Transactional()
  public async execute(port?: unknown): Promise<unknown> {
    runOnTransactionRollback(async (error: Error) => this.useCase.onRollback?.(error, port));
    
    const result: unknown = await this.useCase.execute(port);
    runOnTransactionCommit(async () => this.useCase.onCommit?.(result, port));
    
    return result;
  }
  
}