# lcov_gh_badges

<span id="lcov_coverage"></span>

## TL;DR
A GitHub Action for creating markdown embeddable badges directory from an 
LCOV .dat file.

## Details

This work is based off of the work from schneegans/dynamic-badges-action@v1.6.0
with a difference in that it evaluates the LCOV data format, and automatically
places the values into [environment vairables](#variables). These variable are then used
to create a Gist that can be embedded into an icon URL.


```yaml

...
steps:
  - uses: rrmcguinness/lcov_gh_badges@v1.0.0
    datFile: ./target/coverage.dat
    gistID: e2d1696c1ef0cbc67ef8bcbbfc46313a
    gistFileName: proto-diagram-tool-coverage.json 
    red: 50
    yellow: 70
    icon: 'Google Cloud'
```

* datFile - the location of the lcov data file.
* gistID - the ID of the Gist to write JSON to.
* gistFileName - the name of the gist file, used for creating the URL.
* red - Is <= (less than or equal to) percent to turn the badge red. Default is
60
* yellow - Is <= (less than or equal to) percent to turn the badge yellow.
Default is 75
* green - is any number greater than the yellow threshold.
* icon is the icon name from [Simple Icons](http://simpleicons.org/)

## Variables <a name="varaiables"></a>

* COVERAGE_LINES_TESTED
* COVERAGE_LINES_TOTAL
* COVERAGE_LINES_INSTRUMENTED
* COVERAGE_FILES_TOTAL
* COVERAGE_SCORE - Is equal to: COVERAGE_LINES_TESTED / COVERAGE_LINE_TOTAL






