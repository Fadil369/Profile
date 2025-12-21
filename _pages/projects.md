---
layout: page
title: Projects
permalink: /projects/
description: Healthcare AI innovations transforming clinical operations and patient care.
nav: true
nav_order: 3
display_categories: [healthcare, open-source]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>

---

## Technical Deep Dive & Case Studies

### 1. BrainSAIT - AI-Ambient Scribe & Interoperability
**The Challenge**: Clinical documentation in ICU and Neurosurgery is time-intensive, often leading to physician burnout and data loss.
**The Solution**: A multi-agent AI system that captures ambient clinical conversations and converts them into structured FHIR-compliant notes using:
- **BERT-based Clinical NER**: Custom-trained models for extracting ICD-10 and SNOMED codes.
- **Asynchronous Processing**: FastAPI and Redis-driven pipeline for 99.9% uptime.
- **NPHIES Integration**: Native support for Saudi Arabia's insurance platform.

### 2. GIVC Platform - Global Virtual Care
**The Challenge**: Making telemedicine accessible and interoperable across different health systems (Saudi vs. Sudan).
**The Solution**: A cloud-native platform with:
- **HL7 v2 to FHIR Bridge**: Proprietary mapping logic built with `brainsait-pyheart`.
- **Global Data Vault**: Secure, region-specific encrypted storage complying with local regulations.
- **AI Triage Layer**: Real-time symptom analysis to prioritize critical cases.

### 3. Open Source Ecosystem
Creating standardized tools for the developer community:
- **`pyheart`**: Focuses on the *core* of interoperability — message passing and standards.
- **`pybrain`**: Focuses on the *intelligence* — NLP, Predictive Models, and Clinical Logic.
