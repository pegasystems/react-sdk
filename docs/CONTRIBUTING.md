# Contributing

We welcome contributions to the React SDK repository.

All participants are expected to adhere to the [Code of Conduct](../CODE_OF_CONDUCT.md) and treat each other with respect.

Users and developers may create **issues** to report bugs or suggest new features.

Developers are welcome to also propose **fixes** and/or **new features or components** using the following contribution guidelines.


## Workflow
1. File an issue to notify the maintainers about what you're working on.
2. Fork the repo, develop and test your code changes, add docs.
3. Make sure that your commit messages clearly describe the changes.
4. Send a pull request.

## Style Guides
1. We attempt to follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
2. For our components, we attempt to match the coding style for [Material UI](https://v4.mui.com/) based on their code examples.


## Make the Pull Request

Once you have made all your changes, tests, and updated the documentation,
make a pull request to move everything back into the appropriate branch of the
repository.

Be sure to reference the original issue in the pull request.


## Run Tests

Since the React SDK requires interaction with a running Pega Infinity&trade; server, there is not an automated set of tests provided at this time.

We suggest you begin by using the **MediaCo** application provided in the [React SDK download](https://community.pega.com/marketplace/components/react-sdk). Test your change by using the MediaCo application and completing a complete case flow using the **New Service** casetype provided in that sample application.

Alternately, if you are testing with your own application, provide a link from which maintainers can access your application. Please provide the maintainers with instructions on how they can run your application to confirm that your changes work as expected.
