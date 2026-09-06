# Agent Log

This file explains how I used AI tools while building this project.

## 1. Requirement Analysis (ChatGPT)

I used ChatGPT to analyze the project requirements document and help me think through the project properly.

I used two prompts:

**Prompt 1** — Asked ChatGPT to act as a Product Manager, Architect, QA Lead, and Security Engineer, and analyze the requirements document. It covered product understanding, functional and non-functional requirements, MVP scope, user journeys, system design, data design, engineering breakdown, missing considerations, and a development roadmap.

**Prompt 2** — Asked ChatGPT to act as a Senior/Staff Engineer and make final decisions on all the missing points, ambiguities, and contradictions found in Prompt 1. Instead of just listing options, it had to pick one decision, explain why, and keep things simple instead of over-engineering.

## 2. Reviewing AI Output

I did not accept the AI output as-is.

I went through each suggestion, decision, and requirement change, and:

- Removed suggestions that were unnecessary or too complex for this project.
- Adjusted decisions to match what actually made sense for this product.
- Made the final call myself on anything the AI could not decide safely.

## 3. AI Rules for Development

Based on the finalized decisions, I created a `.ai-rules` file.

This file defines the rules AI should follow while helping me build the project (coding style, scope boundaries, and what not to change without asking).

## 4. Documentation

Using the finalized requirements, I prepared:

- Project Overview
- Requirements document
- Database design/schema

## 5. Implementation

For actual development, I used **Antigravity** to build the project based on the finalized requirements, `.ai-rules`, and documentation above.
