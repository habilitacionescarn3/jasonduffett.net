---
title: "Premature Optimisation - The root of all evil..."
date: 2010-09-05
summary: '"Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at…'
originalUrl: "https://ponchos-lament.blogspot.com/2010/09/premature-optimisation-root-of-all-evil.html"
originalId: "5290560754651049623"
tags:
  - coding
---

"Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: **premature optimization is the root of all evil**. Yet we should not pass up our opportunities in that critical 3%." - Donald Knuth.

What are your thoughts?

My thinking is that the most important considerations, in some sort of rough order, are:

**1\. Is the code clean, clear, understandable and maintainable?**  
_This is my number 1 because if the code is clear & maintainable then fixing any of the following steps becomes much easier._  
**2\. Does it do what it says on the tin?**  
**3\. Is step 2 proven by unit tests, etc?**  
**4\. _(insert individual pet-peeves about maintainability, consistency, testability, etc)_**  
**5\. Does it perform well?**  
_If you’ve got 1-4 sorted then the profiling and optimising required to meet step 5 is easy._

And that's the point...

How do you know what to optimise (the 97%) until you've actually got something working that you can either profile in a reasonable testing environment or, in the case of a brand-new feature, deploy it to production to see how it will perform with actual users in a real-life situation?

This observation also applies to "god" or future-proofing designs. Don't write extra code to cater for hypothetical situations.

_See the full article at [http://c2.com/cgi/wiki?PrematureOptimization](http://c2.com/cgi/wiki?PrematureOptimization) for a more balanced and less-loaded definition of Premature Optimization._
