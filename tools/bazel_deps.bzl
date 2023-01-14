# Third-party dependencies fetched by Bazel
# Unlike WORKSPACE, the content of this file is unordered.
# We keep them separate to make the WORKSPACE file more maintainable.

# Install the nodejs "bootstrap" package
# This provides the basic tools for running and packaging nodejs programs in Bazel
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
def fetch_dependencies():
    http_archive(
        name = "build_bazel_rules_nodejs",
        sha256 = "c2ad51299792d5af3b258f1dd71b3b57eff9424c2e1797d9c1d65717d95da03a",
        urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.7.3/rules_nodejs-5.7.3.tar.gz"],
    )
