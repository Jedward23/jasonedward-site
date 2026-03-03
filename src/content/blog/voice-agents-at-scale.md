---
title: Voice Agents at Scale
description: Lessons from building Codius, an autonomous voice agent that learns and improves over time.
pubDate: 2026-02-28
readTime: 8 min read
---

Voice is the last frontier of AI interaction. Text has been conquered. Vision is being conquered. But voice—real-time, conversational voice—is still wide open.

## Why Voice is Different

Text lets you think. You type, you pause, you revise. Voice doesn't let you do any of that. The agent has maybe 500ms to understand what you said and start responding. That's not a prompt engineering problem—that's a systems problem.

## Building Codius

Codius isn't just a chatbot with a microphone. It's a voice-first agent that:

- **Understands context** — It remembers what you told it yesterday
- **Interrupts appropriately** — It doesn't wait for you to finish if it knows the answer
- **Handles real speech** — Accents, background noise, mumbling
- **Learns from interaction** — Each conversation makes it slightly better

## The Hard Parts

### Latency

Real-time transcription + LLM inference + TTS = 3+ seconds if you're not careful. Users expect responses in 1-2 seconds. We shaved 800ms just by:
- Starting TTS before the LLM finishes
- Using cached embeddings for context
- Streaming tokens instead of waiting for completion

### Context Management

In text, you have chat history. In voice, you need to infer intent from sparse input. We built a memory system that:
- Extracts key facts from each call
- Weights recent conversations higher
- Surfaces relevant context automatically

### Interruption

Users expect natural conversation. That means:
- Detecting when they're done talking (not just silence)
- Jumping in when appropriate
- Backing off when they want to finish their thought

## What's Next

The teams building voice agents today will own customer relationships in 5 years. Text-first interfaces are going to feel slow and clunky in retrospect.

But you can't just bolt a microphone onto a chatbot and call it done. You need to rethink everything from first principles.
