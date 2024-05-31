# OpenAI Changelog Generator GitHub Action

This GitHub Action uses OpenAI's GPT-4 model to generate a changelog based on the provided list of GitHub commits. The generated changelog follows a professional yet friendly tone, is informative, and uses Markdown formatting.

## Table of Contents

- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Example Workflow](#example-workflow)
- [Example Changelog Output](#example-changelog-output)

## Usage

To use this GitHub Action, follow these steps:

1. Create a new workflow file in your repository (e.g., `.github/workflows/generate_changelog.yml`).
2. Add the following content to the workflow file:

    ```yaml
    name: Generate Changelog

    on:
    push:
        branches:
        - main

    jobs:
    generate_changelog:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v3
        - name: Generate Changelog
            id: generate_changelog
            uses: insight-llc/openai-changelog-generator@main
            with:
            openai-api-key: ${{ secrets.OPENAI_API_KEY }}
            changes: ${{ github.event.commits }}
        - name: Create Release
            uses: actions/create-release@v1
            env:
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            with:
            tag_name: ${{ github.ref_name }}
            release_name: Release ${{ github.ref_name }}
            body: ${{ steps.generate_changelog.outputs.changelog }}
    ```

3. Replace `main` with the branch you want to generate the changelog for.
4. Create a new secret in your repository named `OPENAI_API_KEY` and add your OpenAI API key as the value.
5. Commit and push the changes to your repository.

## Inputs

- `openai-api-key`: (required) Your OpenAI API key.
- `changes`: (required) The list of GitHub commits. This input should be provided as a JSON array of commit objects, where each object has the following properties:
  - `message`: The commit message.
  - `url`: The URL of the commit.

## Outputs

- `changelog`: The generated changelog in markdown format as a string.

## Example Workflow

In the example workflow provided above, the action is triggered whenever a push is made to the `main` branch. It generates a changelog using the provided commit list and creates a new release with the generated changelog as the release body.

## Example Changelog Output

Here's an example of the generated changelog output:

```markdown
# Release v1.2.3 (2022-03-25)

The PhotoRoom web team has been working diligently to bring you the latest updates and improvements to enhance your editing experience. We are thrilled to share the following changes with you. Let's dive in! 🤿

These updates wouldn't be possible without the hard work and dedication of our incredible PhotoRoom web team. We are grateful for their commitment to delivering a top-notch editing experience for our users. Wishing everyone a delightful and restful weekend! Stay tuned for more exciting updates coming soon!

## ✨ Features

- Added background removal feature using AI-driven algorithms. ([https://github.com/photoroom/web/pull/1234](#1234))

## 🐛 Bug Fixes

- Fixed an issue where the retouching tool was not working properly. ([https://github.com/photoroom/web/pull/1235](#1235))

## 📝 Documentation

- Updated the README file with more detailed installation instructions. ([https://github.com/photoroom/web/pull/1236](#1236))

## 🎨 Code Style

- Refactored the code to follow a more consistent formatting style. ([https://github.com/photoroom/web/pull/1237](#1237))

## ♻️ Refactoring

- Moved common functions to a separate utility file. ([https://github.com/photoroom/web/pull/1238](#1238))

## ⚡️ Performance Improvements

- Optimized the image processing algorithms to reduce processing time. ([https://github.com/photoroom/web/pull/1239](#1239))

## ✅ Tests

- Added unit tests for the new background removal feature. ([https://github.com/photoroom/web/pull/1240](#1240))

## 👷 Build System

- Updated the build process to use a more efficient build tool. ([https://github.com/photoroom/web/pull/1241](#1241))

## 🔁 Continuous Integration

- Set up automated testing and deployment pipelines. ([https://github.com/photoroom/web/pull/1242](#1242))

## 📝 Chores

- Updated dependencies to the latest versions. ([https://github.com/photoroom/web/pull/1243](#1243))

## ⏪️ Reverts

- Reverted a previous bug fix that introduced a new issue. ([https://github.com/photoroom/web/pull/1244](#1244))
```

This example changelog is based on the provided commits and follows the specified formatting and content requirements.
