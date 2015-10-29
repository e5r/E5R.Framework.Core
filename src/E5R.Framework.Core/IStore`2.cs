// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace E5R.Software.Skeleton.Core
{
    public interface IStore<TEntity, TIdentifier>
    {
        // Retrieve
        IEnumerable<TEntity> Get();
        IEnumerable<TEntity> Search(Expression<Func<TEntity, bool>> where);
        TEntity Find(TIdentifier id);

        // Modification
        TEntity Add(TEntity entity);
        TEntity Modify(TIdentifier id, TEntity entity);
        void Remove(TIdentifier id);
    }
}
