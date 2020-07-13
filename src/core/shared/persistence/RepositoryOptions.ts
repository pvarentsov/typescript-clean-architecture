export type RepositoryFindOptions = {
  includeRemoved?: boolean
};

export type RepositoryUpdateManyOptions = RepositoryFindOptions;

export type RepositoryRemoveOptions = {
  disableSoftDeleting? : boolean
};
