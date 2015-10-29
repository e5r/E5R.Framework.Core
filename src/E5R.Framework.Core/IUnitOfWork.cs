// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

namespace E5R.Software.Skeleton.Core
{
	public interface IUnitOfWork
	{
		void AddAggregate(IAggregate aggregate);
		void SaveWork();
	}
}
