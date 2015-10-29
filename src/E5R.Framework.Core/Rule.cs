// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

using System;

namespace E5R.Software.Skeleton.Core
{
    public class Rule
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public bool ForceBreak { get; set; }
        public Func<bool> Check { get; set; }
    }
}
