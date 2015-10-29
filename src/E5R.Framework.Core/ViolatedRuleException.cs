// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

using System;

namespace E5R.Software.Skeleton.Core
{
	public class ViolatedRuleException : Exception
	{
		public Rule Rule { get; set; }
		public ViolatedRuleException(Rule rule)
			: base($"{ rule.Code } rule violated: { rule.Description }")
		{
			Rule = rule;
		}
	}
}