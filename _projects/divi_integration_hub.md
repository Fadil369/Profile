---
layout: page
title: DIVI — BrainSAIT Integration Hub & Executive Dashboard
description: The Cloudflare-native event bus and OID-aware dashboard every LINC agent runs on top of
img: assets/img/2.jpg
importance: 4
category: development
website: https://dashboard.brainsait.de
selected: true
---

## Overview

**DIVI** (Development Integrated Virtual Intelligence) fronts the infrastructure pillar — the plumbing that every other agent (HIVI, BIKI, COVI) depends on. Its two live production surfaces:

### BrainSAIT Integration Hub

A Cloudflare Worker exposing the event bus every product writes to: `/event`, `/purchase`, `/momfood`, `/telegram/send`, and `/automation/sweep`.

### BrainSAIT Executive Dashboard

Live telemetry across the enterprise OID hierarchy (`1.3.6.1.4.1.61026`, IANA private enterprise number) — portal identity counts, hub status, marketplace catalog size, and hub event volume, all in one OID-aware view.

## OID governance

Every named service in the ecosystem maps to a leaf under `iso.org.dod.internet.private.enterprise.61026`, giving the whole platform a single, auditable namespace — the same registry HIVI uses for its own persona identifiers.

## Links

- **Dashboard**: [dashboard.brainsait.de](https://dashboard.brainsait.de)
- **Hub health check**: [brainsait.de/api/integration/health](https://brainsait.de/api/integration/health)
