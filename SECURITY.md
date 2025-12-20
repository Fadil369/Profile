# Security Policy

## Supported Versions

This is a static portfolio website. The main, deployed version at `https://elfadil.com` (or your primary domain) is the only actively supported version. Security updates are not backported to older commits or forks.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**[citation:1]

If you believe you have found a security issue in this portfolio's code, build configuration, or deployed site, please report it responsibly.

1.  **Contact:** Please email the details to `fadil369@hotmail.com`.
    *   *Tip: Consider using an email like `security@elfadil.com` if available [citation:7].*
2.  **Information to Include:** Please provide a clear description of the issue, the steps to reproduce it, and any potential impact.
3.  **Response:** You can expect an acknowledgment of your report within **48 hours**. We will work with you to understand and address the issue promptly.

## Scope

This policy applies to the source code, build scripts (GitHub Actions), and configuration files (like `_config.yml`) within this repository. It covers the security of the site generation and deployment process.

For the security of third-party services or themes (like the **al-folio Jekyll theme**), please refer to their respective security policies and update them regularly.

## Security Considerations for This Project

As a static site, this project prioritizes the following:
*   **Dependency Security:** Keeping Jekyll, Ruby gems, and Node.js dependencies updated via Dependabot alerts [citation:2][citation:4].
*   **Secret Management:** Ensuring no API keys, tokens, or personal credentials are committed to the repository. GitHub's secret scanning and push protection features are recommended [citation:2][citation:4].
*   **Build Integrity:** Using protected branches and required status checks for the `main` branch to prevent unauthorized changes [citation:7].

## Security Updates

Security updates, if needed, will be committed directly to the `main` branch or via a pull request and noted in the commit history. For critical issues affecting the live site, we will aim to deploy a fix within a reasonable timeframe after validation.
