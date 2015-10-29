// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

using System.Collections.Generic;

namespace E5R.Software.Skeleton.Core
{
    public class ViewModel<TView, TModel>
		where TView : ViewModel<TView, TModel>
		where TModel : new()
    {
		protected IList<Rule> Rules { get; }
		
		public TModel Model { get; set; }
		
		public ViewModel(TModel model)
		{
			Model = model;
			Rules = new List<Rule>();
		}
		
		public IList<string> InvalidateRules() {
			var warnings = new List<string>();
			
			foreach(var rule in Rules)
			{
				if(!rule.Check())
				{
					if(rule.ForceBreak) {
						throw new ViolatedRuleException(rule);
					}
					warnings.Add($"{ rule.Code }: { rule.Description }");
				}
			}
			
			if(1 > warnings.Count) {
				return null;
			}
			
			return warnings;
		}
    }
}
