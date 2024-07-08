const _ = require("lodash");
const core = require("@actions/core");
const { OpenAI } = require('openai');
const github = require("@actions/github");

let changes = core.getInput("changes");
const openApiKey = core.getInput("openai-api-key");
const openAiChat = new OpenAI({ apiKey: openApiKey });
const payload = github.context.payload;
const repositoryOwner = payload.repository.owner.login;
const repositoryName = payload.repository.name;
const version = core.getInput("version");
const releaseDate = new Date();

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
Generate release notes based on github commits using the Conventional Commit standard with gitmojis.

The release notes should:

1. have a professional yet friendly tone.
2. be informative for non-technical users, if necessary reword each entry to be easily understood by a non-technical person.
3. summarize all patch versions into 1 to 3 paragraphs, add context where possible. the summary should be prepended prior to the patch entries.
5. use markdown formatting.
6. remove any references to pull requests, issues, commits, and authors in the following forms: (#xxxx), by @username, etc.
7. not wrap the answer in a codeblock. Just output the text, nothing else.
8. use the following changelog entries to generate the release notes according to the requirements above:

\`\`\`
${changes}
\`\`\`
    `;
}
