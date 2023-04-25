var markdownContent = ''

module.exports = function newmanMarkdownReporter (newman, reporterOptions) {

    //Before an HTTP request is sent
    newman.on('beforeRequest', (err, args) => {
      append(" \n") //extra newline for formatting (using the U+205F empty character)
      append("### " + args.item.name)
      append(args.request.url)
      this.count = 1
    })
    
//     newman.on('request', (err, args) => {
//       if (err) {
//       	append("❗ **Request failure, assertions skipped** ❗")
//       }
//     }

    var assertionParams = [];

    //For every test assertion done within test scripts
    newman.on('assertion', (err, args) => {
      console.log('assertion name ' + args.assertion)
      if (err) {
        assertionParams.push(new Array("❌", this.count, "", "**Assertion failed!**", args.assertion))
      } else if (!args.skipped) {
        assertionParams.push(new Array("✅", this.count, "", "**Assertion passed!**", args.assertion))
      } else {
        assertionParams.push(new Array("⏸️", this.count, "", "**Assertion skipped.**", args.assertion))
      }
      this.count++
    })

    //After test script execution completes
    newman.on('test', (err, args) => {
      for (var i = 0; i < assertionParams.length; i++) {
        assertionParams[i][2] = this.count; //set the total count of assertions
        append(assertionMarkdown.apply(this, assertionParams[i]));
      }
      assertionParams.length = 0
    })

    //Prior to the completion of the run
    newman.on('beforeDone', (err, args) => {   
      if (err) {
        console.log('Encountered an error')
        return;
      }

      markdownContent = markdownContent.trim()
      newman.exports.push({
        name: 'markdown-reporter',
        default: 'markdown-report.txt',
        path: reporterOptions.export,
        content: markdownContent
      })

      console.log('Completed writing Markdown file!')
    })

}

function append(str) {
  markdownContent = markdownContent + str + "\n"
}

function assertionMarkdown(emoji, currCount, totalCount, phrase, assertionName) {
  return emoji + " [" + currCount + " / " + totalCount + "] " + phrase + " `" + assertionName + "`"
}
