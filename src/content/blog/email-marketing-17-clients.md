---
title: Email Marketing at Scale
description: How Frosted manages multiple clients with AI-powered email strategies and stays sane.
pubDate: 2026-02-20
readTime: 12 min read
---

Frosted manages email for 17 clients. That's 17 different brands, 17 different audiences, 17 different goals. Without AI, we'd be drowning.

## The Problem with Email at Scale

Most agencies do email the same way they did in 2010:
- Bulk send to everyone
- Generic segments (by purchase history, mostly)
- Hope the copy resonates

That worked when you had one client and 100k subscribers. It doesn't work when you have 17 clients and 2M subscribers across all of them.

## How We Use AI

Our entire operation runs on three principles:

### 1. Personalization at Scale

We don't do "Hi {{first_name}}, buy this thing." We do actual personalization:
- Each email is written for that specific subscriber
- Subject lines are generated based on their behavior
- Send times are optimized per person

This required building:
- An embeddings database of every subscriber's behavior
- A prompt system that can iterate in <500ms
- A safety layer that catches "weird" generations before they ship

### 2. Testing as a First-Class Feature

We test everything:
- Subject lines (3 variants per send)
- Send times (optimal for each segment)
- Copy length (short vs. long)
- CTA placement

That's a lot of email. But we've learned that the difference between a 2.1% and 2.3% open rate is $50k/month for some clients.

### 3. Feedback Loops

Every email generates data. We:
- Track opens, clicks, conversions
- Feed that back into the personalization model
- Update segment definitions weekly
- Retire emails that consistently underperform

## The Team

We're a 17-person team. That's tiny for managing 2M subscribers. We're able to do it because:
- AI writes most of the copy
- We've automated away the busywork
- We focus on strategy and testing

## What Keeps Us Up at Night

### Compliance

17 clients × regulations (GDPR, CAN-SPAM, etc.) = complexity. We have one person whose entire job is making sure we don't accidentally violate something.

### Quality Variance

AI sometimes generates... weird copy. We've built a multi-layer approval system:
1. Automated safety checks (does this look normal?)
2. Human review of a sample
3. Client approval
4. Final safety scan before send

### Client Alignment

Not all clients want AI-generated copy. Some think it's impersonal. We've learned to be transparent: "This is AI-generated, tested on your audience, and likely to outperform what a human wrote."

## The Results

Our clients see:
- 15-30% lift in open rates
- 10-25% lift in click rates
- 5-15% lift in conversion (varies by client)

That's not magic. That's consistent application of personalization, testing, and feedback loops.

## What's Next

Email isn't dead. It's evolving. The agencies winning are those who've figured out how to scale human-level personalization to millions of subscribers.

Frosted is just getting started.
