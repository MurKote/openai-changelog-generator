const _ = require("lodash");
const core = require("@actions/core");
const { OpenAI } = require('openai');

const changes = core.getInput("changes");
const openApiKey = core.getInput("openai-api-key");
const openAi = new OpenAI({apiKey: openApiKey});

process();

async function process() {
    const parameters = OpenAi.Chat.ChatCompletionCreateParams = {
        messages: [{
                role: "system",
                content: this.buildPrompt(),
            },
            {
                role: "user",
                content: changes,
            }],
        model: "GPT-4o-2024-05-13", 
    };
    const chatCompletion = await openAi.chat.completions.create(parameters);

    console.log(chatCompletion.result);
    core.setOutput("changelog", chatCompletion.result);
}

function buildPrompt() {
    return `
Generate a changelog for the web version of the PhotoRoom app, which offers AI-driven image editing
capabilities such as background removal, retouching, resizing, and more, detailing recent updates.

The changelog should:

1. have a Professional yet friendly tone: The tone should be balanced, not too corporate or too
  informal.
2. be informative: using the provided list of GitHub commits which follow the conventional commit
  standard, break them down into categories such as Features, Bug Fixes, etc. Each category should
  be a leavel 2 heading preceeded by an emoji following the gitmoji standard.
3. list each commit in the category it belongs to, based on the conventional commit standard.
  Remove the gitmoji prefix from the commit message. Also remove any trailing github reference links.
4. summarize the achievements of this release in a manner that is easily understood by non-technical
  readers before listing the commits.
5. use Markdown formatting.
6. use the following syntax to create links: ``[http://www.example.com](This message is a link)``.
7. not wrap the answer in a codeblock. Just output the text, nothing else. Here's a good
  example to follow, please try to match the formatting as closely as possible, only changing
  the content of the changelog and have some liberty with the introduction and conclusion
  paragraphs. Notice the importance of the formatting of a changelog item:
  ````
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))
  ````

 And here's an example of the full changelog:
  ````
  # Release 1.2.3 (2022-03-25)
  The PhotoRoom web team has been working diligently to bring you the latest updates and
  improvements to enhance your editing experience. We are thrilled to share the following changes
  with you. Let's dive in!  🤿

  These updates wouldn't be possible without the hard work and dedication of our incredible PhotoRoom web team. We are grateful for their commitment to delivering a top-notch editing experience for our users. Wishing everyone a delightful and restful weekend!
  Stay tuned for more exciting updates coming soon!

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

  ## 📝 Chores
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))

  ## ⏪️ Reverts
  - We optimize our ci to strip comments and minify production builds. ([https://github.com/facebook/react/pull/27304/](#27304))
  ````

The following are the commits you should use to generate the changelog:

````
${changes}
````
    `;
}
