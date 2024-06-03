const _ = require("lodash");
const core = require("@actions/core");
const { OpenAI } = require('openai');
const github = require("@actions/github");

let changes = core.getInput("changes");
const openApiKey = core.getInput("openai-api-key");
const openAiChat = new OpenAI({apiKey: openApiKey});
const payload = github.context.payload;
const repositoryOwner = payload.repository.owner.login;
const repositoryName = payload.repository.name;

process();

async function process() {
    // changes = (await getCommits()).join("\n");
    console.log(buildPrompt());
    const chatCompletion = await openAiChat.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: buildPrompt(),
        }],
    });

    console.log(chatCompletion.choices[0].message.content);
    core.setOutput("changelog", chatCompletion.choices[0].message.content);
}

function buildPrompt() {
    return `
Generate a changelog based on github commits using the Conventional Commit standard with gitmojis.

The changelog should:

1. have a Professional yet friendly tone: The tone should be balanced, not too corporate or too
  informal.
2. be informative: using the provided list of GitHub commits which follow the conventional commit
  standard, break them down into categories such as Features, Bug Fixes, etc. Each category should
  be a leavel 2 heading preceeded by an emoji following the gitmoji standard. Do not list categories
  that do not have any commits. Use the emojis and headings shown in the template below.
3. list each commit in the category it belongs to, based on the conventional commit standard. Commits
  that do not follow the convention commit standard should be listed at the end in an "Other" category.
  Each listing should read as a complete sentence that can be understood by a non-technical person.
  Each commit should retain the emoji from the commit message.
4. summarize the achievements of this release in a manner that is easily understood by non-technical
  readers before listing the commits.
5. use Markdown formatting.
6. use the markdown syntax to create links: \`(#12345)[http://www.example.com]\`. Links should
  point to GitHub pull requests, if the pull request is mentioned in the message, and show the pull request number prefixed with \`#\` for the github
  repository \`${repositoryOwner}/${repositoryName}\`. All entries will link to the commit.
7. not wrap the answer in a codeblock. Just output the text, nothing else. Here's a good
  example to follow, please try to match the formatting as closely as possible, only changing
  the content of the changelog and have some liberty with the introduction and conclusion
  paragraphs. Notice the importance of the formatting of a changelog item:
  \`\`\`
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)
  \`\`\`

 And here's an example of the full changelog:
  \`\`\`
  # Release 1.2.3 (2022-03-25)
  This release includes crucial bug fixes and ongoing work to enhance our release automation process. We addressed issues with Bugsnag error grouping and fixed repeated calls to cancel multipart uploads, improving overall stability and reliability. Additionally, we are testing new automation features to streamline future releases.

  ## ✨ Features
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## 🐛 Bug Fixes
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## 📝 Documentation
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## 🎨 Code Style
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## ♻️ Refactoring
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## ⚡️ Performance Improvements
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## ✅ Tests
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## 👷 Build System
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## 🔁 Continuous Integration
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## 🧹 Chores
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)

  ## ⏪️ Reverts
  - We optimize our ci to strip comments and minify production builds. ([#27304](https://github.com/facebook/react/pull/27304/), [3f31d8](https://github.com/facebook/react/commits/3f31d8c5d8132cc7e1763b9663344d80778cdf02)
  \`\`\`

The following are the commits you should use to generate the changelog:

\`\`\`
${changes}
\`\`\`
    `;
}
