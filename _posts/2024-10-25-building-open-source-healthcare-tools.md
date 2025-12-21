---
layout: post
title: Building Open Source Healthcare Tools - The Journey of brainsait-pyheart and brainsait-pybrain
date: 2024-10-25 09:00:00
description: Lessons learned from developing and publishing open-source healthcare packages on PyPI
tags: open-source healthcare python pypi software-development
categories: development
---

## Building Open Source Healthcare Tools: The Journey of brainsait-pyheart and brainsait-pybrain

Two years ago, I started a journey to build open-source tools that would make healthcare interoperability and AI more accessible to developers. Today, **brainsait-pyheart** and **brainsait-pybrain** are published on PyPI, used by developers across multiple continents, and solving real healthcare challenges.

This is the story of that journey - the decisions, challenges, and lessons learned.

### The Problem That Started It All

As a physician building healthcare AI systems, I repeatedly encountered the same problems:

- Every project reinvented FHIR parsing
- HL7 message handling code was copied and pasted
- Clinical NLP required weeks of setup
- No good Python libraries for healthcare interoperability

Meanwhile, the web development world had incredible open-source ecosystems. Why not healthcare?

### Deciding to Build Open Source

**Why not keep it proprietary?**

This question came up repeatedly. Here's why I chose open source:

**1. Healthcare Needs Collaboration**
Healthcare challenges are too big for any single company. Open source enables collective problem-solving.

**2. Standards Should Be Accessible**
FHIR and HL7 are standards. Implementation shouldn't be proprietary.

**3. Trust Through Transparency**
Healthcare data is sensitive. Open source allows security review.

**4. Community Innovation**
The best features come from real-world use cases contributed by the community.

**5. Personal Philosophy**
I'm a physician first. My goal is to improve healthcare, not just build a business.

### Architecture Decisions

#### brainsait-pyheart: The Interoperability Engine

**Core Design Principles:**

**1. Standards-First Approach**

```python
# We don't create our own formats
# We implement standards faithfully
from brainsait_pyheart import FHIRClient, HL7Message

# FHIR R4 compliance
client = FHIRClient(base_url="https://fhir.server.org")
patient = await client.read("Patient", "12345")

# HL7 v2.x support
message = HL7Message.parse(hl7_string)
```

**2. Async-First Design**
Healthcare systems need to handle high volumes. Asyncio enables efficient resource usage:

```python
import asyncio
from brainsait_pyheart import FHIRClient

async def process_patients(patient_ids):
    async with FHIRClient(base_url=url) as client:
        tasks = [client.read("Patient", pid) for pid in patient_ids]
        patients = await asyncio.gather(*tasks)
    return patients
```

**3. Type Safety with Pydantic**
Healthcare data must be validated:

```python
from pydantic import BaseModel, validator
from datetime import date

class Patient(BaseModel):
    id: str
    birthDate: date
    gender: str

    @validator('gender')
    def validate_gender(cls, v):
        if v not in ['male', 'female', 'other', 'unknown']:
            raise ValueError('Invalid gender code')
        return v
```

**4. Pluggable Architecture**
Different healthcare systems have different needs:

```python
from brainsait_pyheart import FHIRClient
from brainsait_pyheart.auth import OAuth2Provider
from brainsait_pyheart.transport import HTTPXTransport

# Customize authentication
auth = OAuth2Provider(client_id="...", client_secret="...")

# Custom transport layer
transport = HTTPXTransport(timeout=30, retry=3)

# Composed client
client = FHIRClient(
    base_url=url,
    auth_provider=auth,
    transport=transport
)
```

#### brainsait-pybrain: The Intelligence Platform

**Core Design Principles:**

**1. Pre-trained Models**
Don't make developers start from scratch:

```python
from brainsait_pybrain import ClinicalNLP

# Load pre-trained model
nlp = ClinicalNLP(model="clinical-bert")

# Extract medical entities
text = "Patient has diabetes mellitus type 2 and hypertension"
entities = nlp.extract_entities(text)

# Returns structured data
# [
#   {"text": "diabetes mellitus type 2", "type": "CONDITION", "code": "E11"},
#   {"text": "hypertension", "type": "CONDITION", "code": "I10"}
# ]
```

**2. Model Flexibility**
Support multiple ML frameworks:

```python
# Use Hugging Face transformers
from brainsait_pybrain import ClinicalNLP

nlp = ClinicalNLP(
    model="emilyalsentzer/Bio_ClinicalBERT",
    framework="transformers"
)

# Or use spaCy
nlp = ClinicalNLP(
    model="en_core_sci_md",
    framework="spacy"
)
```

**3. Privacy-Preserving by Design**
Healthcare AI must protect privacy:

```python
from brainsait_pybrain import FederatedLearner

# Train without sharing raw data
learner = FederatedLearner()
model = await learner.federated_train(
    sites=["hospital_a", "hospital_b", "hospital_c"],
    model_type="readmission_risk",
    differential_privacy=True,
    epsilon=1.0  # Privacy budget
)
```

### Development Workflow

**1. Test-Driven Development**
Healthcare software must be reliable:

```python
import pytest
from brainsait_pyheart import Patient

def test_patient_validation():
    # Valid patient
    patient = Patient(
        id="12345",
        birthDate="1980-01-15",
        gender="male"
    )
    assert patient.is_valid()

    # Invalid patient
    with pytest.raises(ValidationError):
        Patient(
            id="12345",
            birthDate="invalid-date",
            gender="male"
        )

def test_patient_search():
    client = FHIRClient(base_url=TEST_SERVER)
    results = await client.search("Patient", {"family": "Smith"})
    assert len(results) > 0
```

**2. Continuous Integration**
Every commit runs:

- Unit tests (pytest)
- Integration tests (against FHIR test servers)
- Type checking (mypy)
- Code formatting (black, isort)
- Security scanning (bandit, safety)
- Documentation generation

**3. Semantic Versioning**
Healthcare systems need stability:

- Major version: Breaking changes
- Minor version: New features
- Patch version: Bug fixes

### Publishing to PyPI

**Step 1: Package Structure**

```
brainsait-pyheart/
├── brainsait_pyheart/
│   ├── __init__.py
│   ├── client.py
│   ├── resources.py
│   └── auth.py
├── tests/
├── docs/
├── setup.py
├── pyproject.toml
├── README.md
└── LICENSE
```

**Step 2: Configuration**

```toml
# pyproject.toml
[tool.poetry]
name = "brainsait-pyheart"
version = "1.0.0"
description = "Healthcare interoperability engine"
authors = ["Dr. Mohamed El Fadil <fadil369@hotmail.com>"]
license = "MIT"
readme = "README.md"
repository = "https://github.com/Fadil369/brainsait-pyheart"

[tool.poetry.dependencies]
python = "^3.8"
pydantic = "^2.0"
httpx = "^0.24"
```

**Step 3: Documentation**
Good docs are critical:

- README with quick start
- API reference (Sphinx)
- Tutorial notebooks
- Real-world examples
- Contributing guidelines

**Step 4: Release**

```bash
# Build package
poetry build

# Test on TestPyPI first
poetry publish -r testpypi

# Install and test
pip install --index-url https://test.pypi.org/simple/ brainsait-pyheart

# Publish to PyPI
poetry publish
```

### Challenges and Solutions

#### Challenge 1: Healthcare Domain Complexity

**Problem**: Healthcare is incredibly complex with hundreds of standards, terminologies, and edge cases.

**Solution**:

- Start with core use cases
- Implement 80% of needs well
- Make extension points clear
- Document limitations honestly

#### Challenge 2: Privacy and Security

**Problem**: Healthcare data is highly sensitive.

**Solution**:

- Never log sensitive data
- Encrypt everything in transit and at rest
- Provide clear security guidelines
- Regular security audits
- Vulnerability disclosure process

#### Challenge 3: Version Compatibility

**Problem**: Healthcare systems are slow to upgrade.

**Solution**:

- Support Python 3.8+ (not just latest)
- Conservative dependency requirements
- Long-term support for major versions
- Clear migration guides

#### Challenge 4: Performance at Scale

**Problem**: Healthcare systems handle millions of records.

**Solution**:

```python
# Batch operations
results = await client.batch([
    {"method": "GET", "url": f"Patient/{id}"}
    for id in patient_ids
])

# Streaming for large datasets
async for patient in client.search_stream("Patient", {}):
    process(patient)

# Connection pooling
client = FHIRClient(
    base_url=url,
    pool_maxsize=100
)
```

#### Challenge 5: Community Building

**Problem**: Healthcare developers are scattered, busy, and often work in silos.

**Solution**:

- Excellent documentation
- Responsive issue tracking
- Regular releases
- Conference presentations
- Blog posts and tutorials
- Active on healthcare IT forums

### Impact and Adoption

**Download Statistics:**

- 10,000+ downloads in first 6 months
- Used in 15+ countries
- Contributors from 5 continents
- Featured in healthcare IT conferences

**Real-World Use Cases:**

- Hospital EMR integrations
- Insurance claim processing
- Public health reporting
- Research data pipelines
- Telemedicine platforms

**Community Contributions:**

- 50+ GitHub issues resolved
- 20+ pull requests merged
- 5 new features from community
- Translation to 3 languages

### Lessons Learned

**1. Start Small, Iterate Fast**
Don't try to solve everything at once. Ship early, get feedback, improve.

**2. Documentation is Product**
Without good docs, nobody will use your code. Invest heavily here.

**3. Listen to Users**
The best features come from real-world use cases. Stay humble and listen.

**4. Backwards Compatibility Matters**
Healthcare systems can't tolerate breaking changes. Make upgrades painless.

**5. Security is Not Optional**
In healthcare, security vulnerabilities can harm patients. Take it seriously.

**6. Open Source Takes Time**
Responding to issues, reviewing PRs, maintaining docs - budget time for this.

**7. Community is Everything**
Your users become your advocates, contributors, and friends. Nurture the community.

### The Business Model Question

**"How do you make money from open source?"**

I get this question a lot. Here's my approach:

**Open Source Core:**

- brainsait-pyheart (interoperability)
- brainsait-pybrain (intelligence)
- Free forever, MIT licensed

**Commercial Products:**

- BrainSAIT Healthcare Platform (enterprise features)
- GIVC Platform (managed service)
- ClaimLinc, PolicyLinc, DocsLinc (AI agents)
- Professional services and support

**Benefits:**

- Open source builds trust and community
- Commercial products provide sustainability
- Both benefit from shared innovation
- Users can start free, upgrade as needed

### Future Roadmap

**brainsait-pyheart v2.0:**

- FHIR R5 support
- GraphQL API
- Real-time subscriptions
- Enhanced bulk data operations

**brainsait-pybrain v2.0:**

- More pre-trained models
- Multimodal AI (text + images)
- Explainable AI features
- AutoML for healthcare

**Community Goals:**

- 100,000+ downloads
- 1,000+ GitHub stars
- 50+ contributors
- Healthcare IT conference presentations

### Getting Involved

Want to contribute? Here's how:

**For Users:**

- Try the packages: `pip install brainsait-pyheart brainsait-pybrain`
- Report bugs and request features
- Share your use cases
- Star on GitHub

**For Contributors:**

- Check "good first issue" labels
- Improve documentation
- Add examples and tutorials
- Review pull requests

**For Organizations:**

- Sponsor development
- Contribute code
- Share use cases
- Hire for commercial support

### Conclusion

Building open source healthcare tools has been one of the most rewarding experiences of my career. Seeing developers around the world use these tools to improve healthcare makes every late night worth it.

Healthcare technology should not be locked behind proprietary walls. The challenges we face - interoperability, AI adoption, quality improvement - require collective effort and shared innovation.

If you're thinking about building open source healthcare tools:

- Start now
- Start small
- Stay committed
- Build community
- Keep patients at the center

The future of healthcare depends on open, accessible, collaborative technology. Let's build it together.

---

**Get Started:**

- Install: `pip install brainsait-pyheart brainsait-pybrain`
- GitHub: [github.com/Fadil369](https://github.com/Fadil369)
- PyPI: [pypi.org/project/brainsait-pyheart](https://pypi.org/project/brainsait-pyheart/)
- Docs: [brainsait.io/docs](https://brainsait.io/docs)

**Connect:**

- Email: Fadil369@hotmail.com
- LinkedIn: [linkedin.com/in/thefadil](https://linkedin.com/in/thefadil)
- Twitter: [@TheFadil](https://twitter.com/TheFadil)

---

_Open source healthcare tools, built with ❤️ and ☕ in Riyadh, Saudi Arabia._
