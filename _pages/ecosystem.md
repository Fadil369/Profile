---
layout: page
permalink: /ecosystem/
title: Ecosystem
description: HIVI · BIKI · DIVI · COVI — the four LINC-orchestrated agents that front every BrainSAIT and elfadil.com surface
nav: true
nav_order: 3.5
---

## One identity, four agents, one MasterLINC brain

Every product I've shipped — across [brainsait.org](https://brainsait.org), [brainsait.de](https://brainsait.de), [elfadil.com](https://elfadil.com), and their subdomains — now sits behind one of four purpose-built front agents. Each agent is a **user-facing persona**; behind it, [MasterLINC](https://github.com/Fadil369/masterlinc) and the specialist LINC agents (ClaimLinc, DocLinc, ClinicalLinc, ComplianceLinc) do the orchestration, wired together over Cloudflare Workers, D1, and MCP servers.

- 🏥 **HIVI** — Health Integrated Virtual Intelligence — clinical & patient-facing surfaces
- 💼 **BIKI** — Business Integrated Knowledge Intelligence — commerce, RCM & marketplace surfaces
- 🛠️ **DIVI** — Development Integrated Virtual Intelligence — infrastructure, APIs & developer tooling
- 🤝 **COVI** — Community Virtual Intelligence — education, incubation & community-facing surfaces

<div class="agent-grid">
  {% for agent in site.data.ecosystem.agents %}
  <div class="agent-card agent-card--{{ agent.key }}" id="{{ agent.key }}">
    <div class="agent-card__head">
      <div class="agent-card__icon">{{ agent.icon }}</div>
      <div>
        <h3 class="agent-card__name">{{ agent.name }}</h3>
        <span class="agent-card__acronym">{{ agent.acronym }}</span>
      </div>
    </div>
    <span class="agent-card__status pill pill--{{ agent.status_class }}">{{ agent.status_label }}</span>
    <p class="agent-card__mission">{{ agent.mission }}</p>
    <ul class="agent-card__links">
      {% for link in agent.links %}
      <li><a href="{{ link.url }}"{% if link.url contains '://' %} target="_blank" rel="noopener"{% endif %}>{{ link.title }}</a></li>
      {% endfor %}
    </ul>
  </div>
  {% endfor %}
</div>

---

## Live surface directory

A working audit of every domain and subdomain currently in production, as reviewed for this ecosystem pass.

<div style="overflow-x:auto;">
<table class="surface-directory">
  <thead>
    <tr><th>Surface</th><th>Agent</th><th>Role</th><th>Status</th></tr>
  </thead>
  <tbody>
    {% for s in site.data.ecosystem.surfaces %}
    <tr>
      <td><a href="{{ s.url }}" target="_blank" rel="noopener">{{ s.label }}</a></td>
      <td>{%- case s.agent -%}
        {%- when 'none' -%}—
        {%- when 'multi' -%}Multi
        {%- else -%}{{ s.agent | upcase }}
        {%- endcase -%}</td>
      <td>{{ s.role }}</td>
      <td><span class="pill pill--{{ s.status_class }}">{{ s.status_label }}</span></td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>

---

## Recent design previews

A few interface concepts were shared as Figma reviews ahead of the next build pass — flagged here for the record rather than described in detail, since the assets require Figma access to open:

{% for preview in site.data.ecosystem.design_previews %}

- [{{ preview.label }}]({{ preview.url }})
  {% endfor %}

If these should feed directly into the next round of `/ecosystem/` or `/projects/` updates, share exported frames or screenshots and they'll be folded in with full detail.

---

_This page is maintained as a living audit — see [Projects](/projects/) for full case studies and [Products](/products/) for pricing and packaging._
