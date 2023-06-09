# newman-reporter-basicmarkdown

A basic Markdown reporter for [Newman](https://github.com/postmanlabs/newman).


## Description

Will generate a plain text file in the `./newman` directory containing the formatted Markdown text.

Example:
```
### Request Name 1
https://exampleRequest1Url.com
✅ [1 / 2] **Assertion passed!** `Status code is 200`
❌ [2 / 2] **Assertion failed!** `JSON response body has valid fields`

### Request Name 2
https://exampleRequest2Url.com
✅ [1 / 2] **Assertion passed!** `Status code is 200`
⏸️ [2 / 2] **Assertion skipped.** `JSON response matches schema`

```

...which looks like the below when formatted as Markdown:

![example markdown_text](images/markdownExample.png)

## Usage

This reporter is used with [Newman](https://github.com/postmanlabs/newman) so if you haven't already installed that run `npm install -g newman`.

Install using `npm i newman-reporter-basicmarkdown`.

Use by specifying the Markdown reporter as a reporter option like so: `newman run collection.json -r markdown`.

