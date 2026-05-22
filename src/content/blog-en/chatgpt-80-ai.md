---
title: "ChatGPT Overturns 80-Year-Old Math Conjecture: Fields Medalist Hails 'AI Math Milestone'"
date: "2026-05-21"
tag: "OpenAI"
excerpt: "OpenAI's general reasoning model has overturned an 80-year-old mathematical conjecture by discovering a new structure that generates more unit distance pairs than previously thought possible. This breakthrough, verified by external mathematicians and hailed by Fields medalist Tim Gowers as an 'AI math milestone,' marks the first time an AI has independently solved a central open problem in mathematics. It demonstrates AI's growing ability to engage in creative scientific research upstream, proposing novel ideas and linking interdisciplinary knowledge."
---

A simple ruler of length one has propelled AI to the forefront of mathematical research.

Consider an infinite plane with n points placed such that any two points are exactly distance one apart—these are called "unit distance pairs." What is the maximum number of such pairs possible?

In 1946, mathematician Paul Erdős posed this problem. For nearly 80 years, the mathematical community believed the optimal solution approached structures like the square lattice, akin to tiling a chessboard.

![画像](/images/blog/chatgpt-80-ai/img-1.png)
The tweet had amassed over 3.2 million views at the time of posting.

OpenAI has now presented a radically different result.

According to OpenAI's official blog, their general reasoning model has discovered a new family of structures that generate more unit distance pairs than the square lattice conjecture. This result challenges the long-standing conjecture that Erdős's upper bound for the unit distance number is n^(1+o(1)).

The proof has been verified by external mathematicians, and a paper explaining the background and significance has been published.

Notably, OpenAI attributes this proof to their general reasoning model. The model was not specifically designed for the unit distance problem nor was it a dedicated mathematical proof-search system. As OpenAI explains, this is the first instance where an AI has independently solved a central open problem in a specific field of mathematics.

For the mathematical community, the fact that an approximately 80-year-old classical conjecture has been overturned is monumental. However, for the AI industry, it signals that models are beginning to extend into the upstream of scientific creativity—proposing new ideas, linking interdisciplinary knowledge, and advancing complex arguments to levels reviewable by expert professionals.

## Distance One, Conjecture Eighty Years

The planar unit distance problem is one of the most famous problems in combinatorial geometry.

In the 2005 book *Research Problems in Discrete Geometry*, Brass, Moser, and Pach described it as "probably the most famous and easily stated problem in combinatorial geometry." Combinatorial mathematician Noga Alon noted that it was one of Erdős's favorite problems, and he had even offered prize money for its solution.

Mathematically, the answer is typically denoted as u(n)—the maximum number of unit distance pairs among n points in the plane. Researchers focus on how u(n) grows as n increases.

The simplest configuration is placing n points on a line. If adjacent points are distance one apart, we get n-1 unit distance pairs.

A slightly more complex configuration is the square lattice. Arranging points like on a grid allows each point to be unit distance from its adjacent neighbors above, below, left, and right, yielding approximately 2n unit distance pairs.

![密集した黒いネットワークグラフで、正方形パターンを形成する相互接続されたノード](/images/blog/chatgpt-80-ai/img-2.webp)
One known structure: a rescaled square lattice generates numerous unit distances.

Erdős's 1946 construction was more sophisticated. Using a rescaled square lattice, he achieved an order of n^(1+C/log log n) unit distance pairs (where C is a constant). This grows faster than linear in n, but the speed is extremely limited. As n grows, C/log log n approaches zero, so overall it remains close to linear growth.

For years, mathematicians believed that square lattice-based structures were near the limit for this problem. Based on this, Erdős conjectured that the upper bound for u(n) is n^(1+o(1)), where o(1) represents a term that approaches zero as n increases. In simpler terms, the number of unit distance pairs might slightly exceed linear growth, but there should be no exponential advantage with a fixed ratio.

OpenAI's new result overturns this expectation.

According to their official blog, the model constructed a family of structures with infinitely many examples. For infinitely many n, it is possible to place n points in the plane and obtain at least n^(1+δ) unit distance pairs (where δ is a positive constant). The original AI proof did not specify the value of δ, but subsequent refinement by Princeton mathematics professor Will Sawin showed that δ=0.014.

While square lattice-based structures were thought to be near-optimal, OpenAI's new structures achieve a fixed exponential advantage for infinitely many n, breaking through the n^(1+o(1)) view.

The shock to the field stems from two reasons. First, the weight of the problem itself: the planar unit distance problem is simple to state but has seen slow essential progress.

The lower bound had long been improved along Erdős's initial construction, but the best upper bound of O(n^(4/3)) came from work by Spencer, Szemerédi, and Trotter in 1984. Since then, researchers like Székely, Katz, Silier, Pach, Raz, and Solymosi studied related structures, but a significant gap remained between the core upper and lower bounds.

Second, the tools used in the new proof defied many expectations. Historically, researchers naturally considered geometric and combinatorial structures for this problem. However, OpenAI's model's approach led the problem into algebraic number theory.

Erdős's initial construction can be understood via Gaussian integers—a+bi (where a, b are integers and i is the square root of -1), which extend regular integers and retain properties similar to unique factorization. This structure explains why some rescaled square lattices generate many unit distances.

OpenAI's new proof uses more complex algebraic number fields. These fields can be seen as extensions of rational numbers and integers, incorporating richer symmetric structures. OpenAI explains that these structures generate numerous differences of unit length, enabling points in the plane to form more unit distance pairs.

The proof also employs tools such as infinite class field towers and the Golod-Shafarevich theory. While these concepts are familiar within algebraic number theory, their sudden appearance in a combinatorial geometry problem in the Euclidean plane carries strong implications for interdisciplinary fusion.

External mathematicians view this as key to the achievement. Thomas Bloom, an author on the related paper, wrote that an important criterion for evaluating AI-generated proofs is whether they deepen human understanding of the problem. In his view, the answer is a cautious yes—this result suggests that the influence of number-theoretic structures on discrete geometry problems may be deeper than previously thought.

Combinatorial mathematician Noga Alon stated that Erdős frequently mentioned the unit distance problem in lectures, and it is a problem that nearly every combinatorial geometer has considered, with many mathematicians from other fields also spending time on it. Alon finds it remarkable that OpenAI's internal model solved this long-standing open problem. Particularly astonishing is that, instead of the long-conjectured n^(1+o(1)), the new structure and its analysis skillfully employ highly advanced tools from algebraic number theory.

Fields medalist Tim Gowers, in the related paper, called this result a "milestone for AI mathematics."

Number theorist Arul Shankar remarked that the paper demonstrates that current AI models can present original and clever ideas and push them into complete proofs.

## AI Enters the Upstream of Research, and the Role of Human Experts

OpenAI repeatedly emphasizes in their official blog that the origin of the model itself is important.

As OpenAI explains, the proof comes from a new general reasoning model. It was not specifically trained for the unit distance problem nor designed as a mathematical proof-search system. In a broader evaluation, OpenAI had the model handle a series of Erdős problems, and as a result, the model provided a proof for the planar unit distance problem.

![画像](/images/blog/chatgpt-80-ai/img-4.png)
After verifying the initial proof, OpenAI investigated the model's success probability on this problem under different computational budgets at test time.

Over the past few years, AI capabilities in mathematics have rapidly improved. Models can now solve competition problems, assist with formal proofs, help search for materials, and generate proof drafts. However, many of these abilities required humans to provide clear direction or remained on the periphery of existing knowledge systems.

The case OpenAI now claims represents a much larger step forward. The model confronted a long-standing unsolved problem, proposed new structures, and completed a proof reviewable by external experts. In other words, AI has begun to reach into more core aspects of mathematical research—namely, the "discovery of pathways" itself.

Mathematics is well-suited for verifying such capabilities. The reasons are straightforward: problems are clearly defined, proofs are verifiable, and breaks in reasoning affect the entire result. A model achieving such tasks suggests it possesses the ability to maintain long chains of reasoning and apply distant knowledge or tools to the same problem.

Even in smaller research problems, public examples of similar capabilities already exist. Tim Gowers had ChatGPT 5.5 Pro handle an unsolved number theory problem. Within two hours, the model provided mathematical research close to doctoral-level work, significantly improving existing bounds.

Gowers stated that he contributed almost no mathematical content and did not use complex prompts. The problem was sourced from a paper by number theorist Mel Nathanson, concerning the possible sizes of integers and sets, and methods for efficiently constructing sets with specific properties. Young researchers involved believed the model's key ideas were "completely original."

![GPT 5.5 Proが、数学博士論文の一章に相当する成果を証明：フィールズ賞受賞者Timothy Gowers](/images/blog/chatgpt-80-ai/img-5.jpg)

Looking at these examples together, the role of generative AI is shifting. It is moving from the "problem-solving stage" to the "early stages of conducting research."

Models are no longer just providing answers when given problems and methods. They have begun proposing structures within unsolved problems, improving bounds, and exploring proof routes.

OpenAI aims to apply this case to broader scientific research scenarios. Their official blog states that if models can maintain consistency in complex mathematical arguments, link different knowledge domains, and produce outcomes withstand expert review, similar capabilities could contribute to research in fields like biology, physics, materials science, engineering, and medicine.

Of course, the full research process for this difficult problem still cannot do without human experts. A crucial premise for the AI proof's results to be seriously discussed is that the proof has been verified by external mathematicians, and the related paper provides background, explanation, and mathematical context.

AI proposes critical breakthroughs, human experts judge their correctness and interpret their significance, and continue to explore whether they can be extended to other problems.

In summary, AI is far from replacing mathematicians, but it harbors the potential to change the labor structure of mathematical research. Especially as AI becomes capable of proposing complex pathways in bulk, the core tasks of future researchers will increasingly focus on three points: judging whether a problem is important, judging whether results are trustworthy, and judging which routes are worth continued investment.

And what OpenAI's model provided was a kind of structure that even Erdős could not have imagined. This is also the highest tribute to Erdős, known for his austere lifestyle and travels as a mathematical troubadour. The method of problem-solving may be even more astonishing than the solution itself.