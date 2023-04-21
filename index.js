var markdownContent = ''

module.exports = function newmanMarkdownReporter (newman, reporterOptions) {

    //Before an HTTP request is sent
    newman.on('beforeRequest', (err, args) => {
      console.log('item name ' + args.item.name)
      append("### " + args.item.name)
      append(args.request.url)
      this.count = 0
    })

    var assertionParams = [];

    //For every test assertion done within test scripts
    newman.on('assertion', (err, args) => {
      this.count++
      console.log('assertion name ' + args.assertion)
      if (err) {
        assertionParams.push(new Array("❌", this.count, "", "**Assertion failed!**", args.assertion))
      } else {
        assertionParams.push(new Array("✅", this.count, "", "**Assertion passed!**", args.assertion))
      }
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

      newman.exports.push({
        name: 'markdown-reporter',
        default: 'markdown-report.txt',
        path: reporterOptions.export,
        content: markdownContent
      })

      console.log('CSV write complete!')
    })

}

function append(str) {
  markdownContent = markdownContent + str + "\n"
}

function assertionMarkdown(emoji, currCount, totalCount, phrase, assertionName) {
  return emoji + " [" + currCount + " / " + totalCount + "] " + phrase + " `" + assertionName + "`"
}