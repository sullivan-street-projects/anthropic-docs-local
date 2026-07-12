---
title: "Introducing Contextual Retrieval"
source_url: "https://www.anthropic.com/engineering/contextual-retrieval"
source_type: "web-extracted"
fetched_at: "2026-07-12T00:00:00Z"
category: "engineering"
---

# Introducing Contextual Retrieval

**Published September 19, 2024**

## Overview

AI models require background knowledge to operate effectively in specific contexts. Developers enhance model capabilities using Retrieval-Augmented Generation (RAG), which retrieves relevant information from knowledge bases and appends it to user prompts. However, traditional RAG systems remove crucial context during information encoding, causing retrieval failures.

Anthropic introduces **Contextual Retrieval**, a method combining two sub-techniques:

- Contextual Embeddings
- Contextual BM25

This approach reduces retrieval failures by 49%, or 67% when combined with reranking, significantly improving downstream task performance.

## When to Use Simple Approaches

For knowledge bases under 200,000 tokens (approximately 500 pages), including the entire knowledge base in the prompt eliminates the need for RAG. Combined with prompt caching, this approach reduces latency by over 2x and costs by up to 90%.

For larger knowledge bases, Contextual Retrieval offers a scalable solution.

## Understanding RAG Fundamentals

Traditional RAG involves:

1. Breaking documents into smaller chunks (typically several hundred tokens)
2. Converting chunks into vector embeddings capturing semantic meaning
3. Storing embeddings in searchable vector databases

At runtime, the system finds relevant chunks through semantic similarity and adds them to the prompt.

### Combining Embeddings with BM25

While embedding models excel at semantic relationships, they miss exact matches. BM25 (Best Matching 25) uses lexical matching for precise word and phrase identification, particularly effective for unique identifiers or technical terms.

BM25 builds on TF-IDF (Term Frequency-Inverse Document Frequency) concepts, considering document length and applying saturation functions to term frequency, preventing common words from dominating results.

**Example:** For "Error code TS-999" queries, BM25 identifies exact text matches that embeddings might miss.

Effective RAG combines both approaches:

- Use BM25 for top exact matches
- Use embeddings for semantic similarity
- Merge results through rank fusion
- Select top-K chunks for the prompt

## The Context Problem

Traditional RAG's limitation: individual chunks often lack sufficient context.

**Example:** A chunk stating "The company's revenue grew by 3% over the previous quarter" lacks company name and timeframe context, making retrieval and interpretation difficult.

## Introducing Contextual Retrieval

This solution prepends chunk-specific explanatory context before embedding and indexing.

**Transformation example:**

- Original: "The company's revenue grew by 3% over the previous quarter."
- Contextualized: "This chunk is from an SEC filing on ACME corp's performance in Q2 2023; the previous quarter's revenue was $314 million. The company's revenue grew by 3% over the previous quarter."

### Implementation

Rather than manually annotating millions of chunks, Anthropic uses Claude to generate concise, chunk-specific context. The process uses this prompt:

```
<document>
{{WHOLE_DOCUMENT}}
</document>
Here is the chunk we want to situate within the whole document
<chunk>
{{CHUNK_CONTENT}}
</chunk>
Please give a short succinct context to situate this chunk within the
overall document for improving search retrieval. Answer only with the
succinct context.
```

Resulting contextual text (typically 50-100 tokens) is prepended before embedding and indexing.

### Cost Efficiency

Using prompt caching, Contextual Retrieval achieves low preprocessing costs: **$1.02 per million document tokens** (assuming 800-token chunks, 8k-token documents, 50-token instructions, and 100 tokens of context per chunk).

## Performance Results

### Methodology

Experiments covered multiple knowledge domains (codebases, fiction, ArXiv papers, Science Papers), embedding models, and retrieval strategies. Evaluation metrics included 1-minus-recall@20, measuring relevant document retrieval failure rates within top 20 chunks.

### Key Findings

- **Contextual Embeddings** reduced retrieval failure rates by 35% (5.7% to 3.7%)
- **Contextual Embeddings + Contextual BM25** reduced failure rates by 49% (5.7% to 2.9%)

### Implementation Considerations

1. **Chunk boundaries:** Chunk size, boundaries, and overlap significantly affect retrieval performance
2. **Embedding models:** Gemini and Voyage embeddings performed particularly well
3. **Custom prompts:** Domain-specific prompts may improve results further
4. **Chunk quantity:** Testing revealed 20 chunks outperformed 5 or 10 chunks
5. **Evaluation:** Always run evaluations to distinguish contextualized chunks from actual content

## Enhancing Performance with Reranking

Reranking filters initial retrieval results, ensuring only the most relevant chunks reach the model.

### Process

1. Perform initial retrieval (top 150 chunks tested)
2. Pass top-N chunks with user query through reranking model
3. Score chunks by relevance; select top-K (20 chunks tested)
4. Add top-K chunks as context for final response

### Results

**Reranked Contextual Embeddings + Contextual BM25** reduced retrieval failure rates by 67% (5.7% to 1.9%).

### Trade-offs

Reranking adds runtime latency but improves accuracy. Balance performance gains against latency and cost constraints through experimentation.

## Key Takeaways

Comprehensive testing revealed:

1. Embeddings+BM25 outperforms embeddings alone
2. Voyage and Gemini embeddings rank highest
3. Passing 20 chunks exceeds 5 or 10 chunk performance
4. Adding context substantially improves retrieval accuracy
5. Reranking enhances results
6. **All benefits compound:** Optimal performance combines contextual embeddings (Voyage/Gemini), contextual BM25, reranking, and 20-chunk delivery

Developers working with knowledge bases should explore these approaches through Anthropic's cookbook implementation to achieve enhanced performance.

## Acknowledgments

Research and writing by Daniel Ford. Contributors included Orowa Sikder, Gautam Mittal, Kenneth Lien, Samuel Flamini, Lauren Polansky, Alex Albert, Susan Payne, Stuart Ritchie, and Brad Abrams.
