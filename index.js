const _ = require("lodash");
const core = require("@actions/core");
const { OpenAI } = require('openai');
const github = require("@actions/github");

let changes = core.getInput("changes");
const openApiKey = core.getInput("openai-api-key");
const openApiUrl = core.getInput("openai-api-url");
const openAiChat = new OpenAI({ apiKey: openApiKey, baseURL: openApiUrl });
const payload = github.context.payload;
const repositoryOwner = payload.repository.owner.login;
const repositoryName = payload.repository.name;
const version = core.getInput("version");
const releaseDate = new Date();

process();

async function process() {
    console.log(buildPrompt());
    const chatCompletion = await openAiChat.chat.completions.create({
        model: "gpt-4o-mini",
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
3. summarize all patch versions into 1 to 3 paragraphs and add context where possible. Avoid any intro and outro sentences. The summary should be prepended prior to the patch version header.
4. the version and section headers should be left unchanged, and retain the html tags.
5. limit the release notes to the summary and the first version entry only.
6. use markdown formatting.
8. each entry should read as a complete, syntactically correct sentence.
9. not wrap the answer in a codeblock. Just output the text, nothing else.
10. keep the sections in the existing order: "Added", "Changed", "Fixed", "Removed".
11. use the following changelog entries to generate the release notes according to the requirements above:

\`\`\`
${changes}
\`\`\`
    `;
}
