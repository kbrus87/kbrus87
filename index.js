const fs = require('fs').promises


;
(async() => {
    const markdownTemplate = await fs.readFile('./README.md.tpl', { encoding: 'utf-8' })


    const date = new Date();
    newMarkdown = markdownTemplate.replace('%date%', date);

    //writes readme with changes
    await fs.writeFile('./README.md', newMarkdown);
})();