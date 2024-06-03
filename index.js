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
    changes = (await getCommits()).join("\n");
    console.log(buildPrompt());
    const chatCompletion = await openAiChat.chat.completions.create({
        model: "gpt-3.5-turbo",
        prompt: buildPrompt(),
        max_tokens: 50,
    });

    console.log(chatCompletion.result);
    core.setOutput("changelog", chatCompletion.result);
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
  that do not have any commits.
3. list each commit in the category it belongs to, based on the conventional commit standard. Commits
  that do not follow the convention commit standard should be listed at the end in an "Other" category.
  Each listing should read as a complete sentence.
4. summarize the achievements of this release in a manner that is easily understood by non-technical
  readers before listing the commits.
5. use Markdown formatting.
6. use the following syntax to create links: \`[http://www.example.com](#12345)\`. Links should
  point to GitHub pull requests and only show the pull request number prefixed with \`#\` for the github
  repository \`${repositoryOwner}/${repositoryName}\`.
7. not wrap the answer in a codeblock. Just output the text, nothing else. Here's a good
  example to follow, please try to match the formatting as closely as possible, only changing
  the content of the changelog and have some liberty with the introduction and conclusion
  paragraphs. Notice the importance of the formatting of a changelog item:
  \`\`\`
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))
  \`\`\`

 And here's an example of the full changelog:
  \`\`\`
  # Release 1.2.3 (2022-03-25)
  This release includes crucial bug fixes and ongoing work to enhance our release automation process. We addressed issues with Bugsnag error grouping and fixed repeated calls to cancel multipart uploads, improving overall stability and reliability. Additionally, we are testing new automation features to streamline future releases.

  ## ✨ Features
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## 🐛 Bug Fixes
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## 📝 Documentation
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## 🎨 Code Style
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## ♻️ Refactoring
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## ⚡️ Performance Improvements
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## ✅ Tests
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## 👷 Build System
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## 🔁 Continuous Integration
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## 🧹 Chores
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## ⏪️ Reverts
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))
  \`\`\`

The following are the commits you should use to generate the changelog:

\`\`\`
${changes}
\`\`\`
    `;
}

async function getCommits(startRef, endRef) {
    const octokit = github.getOctokit(core.getInput("github-token"));
    let allCommits = [];
    let page = 1;

    while (true) {
        const commits = await octokit.repos.listCommits({
            owner: repositoryOwner,
            repo: repositoryName,
            sha: endRef,
            per_page: 100, // Adjust the per_page value as needed
            page: page, // Fetch the current page
        });

        const filteredCommits = commits.data.filter(commit => {
            return commit.sha!== startRef;
        });

        allCommits = allCommits.concat(filteredCommits);

        if (octokit.hasNextPage(commits)) {
            page++;
        } else {
            break;
        }
    }
console.log("commits: ", allCommits);
    return allCommits;
}
