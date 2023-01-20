# lcov_gh_badges

## TL;DR
A GitHub Action for creating markdown embeddable badges directory from an 
LCOV .dat file.

## Details

This work is based off of the work from schneegans/dynamic-badges-action@v1.6.0
with a difference in that it evaluates the LCOV data format, and automatically
places the values into [environment vairables](#variables). These variable are then used
to create a Gist that can be embedded into an icon URL.

### Minimal Configuration
```yaml
...
steps:
  - uses: rrmcguinness/lcov_gh_badges@v1.0.0
    file: ./target/coverage.dat
```

### Complete Configuration
```yaml
...
steps:
- uses: rrmcguinness/lcov_gh_badges@v1.0.0
  file: ./target/coverage.dat
  accessToken: ${ACCESS_TOKEN}
  style: flat
  icon_name: googlecloud,
  icon_color: 'ffffff',
  label: 'Coverage'
  label_color: 'ffffff'
  critical: 60
  criticalColor: '9c2c9c'
  warning: 75
  warningColor: 'd68f0c'
  success_color: '43ad43'
  message_color: 'ffffff'
```

## Variables <a name="varaiables"></a>

* COVERAGE_LINES_TESTED
* COVERAGE_LINES_TOTAL
* COVERAGE_LINES_INSTRUMENTED
* COVERAGE_FILES_TOTAL
* COVERAGE_SCORE - Is equal to: COVERAGE_LINES_TESTED / COVERAGE_LINE_TOTAL






