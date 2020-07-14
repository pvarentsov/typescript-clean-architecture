export type RepositoryFindOptions = {
  includeRemoved?: boolean
  limit?: number;
  offset?: number;
};

export type RepositoryUpdateManyOptions = {
  includeRemoved?: boolean
};

export type RepositoryRemoveOptions = {
  disableSoftDeleting? : boolean
};
