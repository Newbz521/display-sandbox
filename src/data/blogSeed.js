export const BLOG_SEED = [
  {
    slug: 'mcp-design',
    title: 'Thoughts on the future of MCP design',
    date: '05/21/2026',
    blurb: `In the age of AI, I think a lot of MCP design is already heading in the wrong direction.

Giving an LLM access to 50 tools doesn't automatically make it more capable. If every tool dumps raw data back into the context and expects the model to calculate, filter, sort, validate, and figure out what matters, you're just moving backend work onto the LLM.

That feels backwards.

If something can be calculated or determined reliably with code, it probably should be. The MCP layer should do that work before the result ever reaches the model.

Don't give the LLM 2,000 database rows and ask it to find the trend. Calculate the trend. Don't give it 100 search results and ask it to remove duplicates and rank them. Do that first. Don't make the model interpret messy API responses when your MCP already knows exactly what those fields mean.

Every unnecessary decision you push onto the LLM costs context, time, and reliability.

I think the best MCP tools will actually feel boring. They will have narrow responsibilities, predictable inputs, strong validation, and return exactly what the model needs to make the next decision.

Code should handle precision and predictable logic. The LLM should handle ambiguity, reasoning, and judgment.

The goal shouldn't be to make the LLM do everything.

The goal should be to build the system around it so it doesn't have to.
`,
  },
  {
    slug: 'architecture-and-ai',
    title: 'Architecture and AI',
    date: '08/10/2026',
    blurb: `I think AI has the potential to push architecture back toward what architects are actually supposed to do: design.

As someone who studied architecture, design studio in college was probably the last time I genuinely enjoyed the field. School gave me the impression that architecture was primarily about exploring space, form, materials, context and experience.

Working in an actual architecture firm was a very different reality.

I don't think architecture school accurately represents what the profession eventually requires from you. The transition from school to practice can become a frustrating back and forth between what you're passionate about designing and what the profession actually expects you to spend your time doing.

Code, zoning, compliance, documentation, coordination, revisions and calculations are all necessary, but they can easily consume the job. For me, that created a pretty toxic relationship with the field. The passion that gets people into architecture rarely seems to line up with the expectations of actually practicing it.

That's why AI in architecture interests me.

I don't want AI designing buildings for architects. I want it working in the background, constantly checking zoning, code, accessibility, egress, calculations and technical constraints while the architect designs.

The architect still makes the decisions and takes responsibility. AI just removes more of the repetitive technical work surrounding those decisions.

Maybe the biggest opportunity for AI isn't replacing architects at all. Maybe it's closing some of the gap between the architecture people fall in love with in school and the architecture they're actually able to practice.`,
  },
  {
    slug: 'slowing-down',
    title: 'Slowing down',
    date: '08/11/2026',
    blurb: `I've been thinking a lot about the difference between actually understanding how to use AI and simply being excited that AI can do something.

A random conversation I overheard in SoHo put a sharper edge on that.

I was shopping with my wife. She went into the fitting room, so naturally I found one of those couches sitting between the clothing aisles and took a seat.

While sitting there, I couldn't help but overhear a conversation between two friends. One of them was a young animator working for a studio.

He was talking about how he had spent over a year modeling assets for a scene. The work was basically done.

Then, apparently, an executive made a last minute decision: switch the models to an AI generated one.

The animator pushed back. Not because he was against AI, but because the generated model had a completely different style and wouldn't fit the scene they had already built.

The response?

"Then generate the scene with AI to match."

That stuck with me.

Over a year of work. Already completed. And instead of using AI to improve the existing work or help the animator move faster, the solution was essentially to throw everything away and regenerate it.

It made me wonder if we're entering a strange phase where some executives are dabbling in AI and suddenly feel qualified to make decisions about every role AI touches.

There's a huge difference between understanding what AI can generate and understanding the craft you're trying to replace.

AI is an incredible tool. I use it constantly. But "AI can do this" and "AI should do this" are two completely different conversations.

What bothered me most wasn't even the decision itself. It was hearing how discouraged this young animator sounded. He's at the beginning of his career, spent a year developing his craft and contributing to something, and then watched that work get scrapped simply because AI became an option.

That's not really AI adoption to me.

Good AI adoption should amplify the people who already understand the work. Give the animator better tools. Let them iterate faster. Let them automate repetitive parts of the process. Let AI expand what a small team can accomplish.

But replacing completed work just because you can generate something now?

At some point, that's not innovation.

That's just someone discovering a new button and wanting to press it.`,
  },
]
