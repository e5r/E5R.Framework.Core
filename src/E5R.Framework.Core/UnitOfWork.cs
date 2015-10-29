// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

using System.Collections.Generic;
using System.Linq;

namespace E5R.Software.Skeleton.Core
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IList<IAggregate> _works;

        public UnitOfWork()
        {
            _works = new List<IAggregate>();
        }

        public void AddAggregate(IAggregate aggregate)
        {
            if (!_works.Contains(aggregate))
            {
                _works.Add(aggregate);
                aggregate.Seed();
            }
        }
        
        public void SaveWork()
        {
            foreach(var work in _works.Where(w => w.HasChanges()))
            {
                work.SaveChanges();
            }
        }
    }
}
