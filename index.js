const core = require('@actions/core')
const github = require('@actions/github')
const aws = require('aws-actions-configure-aws-credentials')
const { getMatterConfig } = require('@mattersupply/cli/lib/config')
const { fetchValues } = require('@mattersupply/cli/lib/remote-config')
const { kebabCase } = require('lodash')

const getBuildIdentifier = function () {
  const branchNameMatches = github.context.ref.match(
    /^refs\/heads\/(?<branch>.+)$/
  )
  const branchName = branchNameMatches
    ? branchNameMatches.groups['branch']
    : null

  const tagNameMatches = github.context.ref.match(/^refs\/tags\/(?<tag>.+)$/)
  const tagName = tagNameMatches ? tagNameMatches.groups['tag'] : null
  console.log('Branch Name: ', branchName, 'Tag: ', tagName)

  const buildIdentifier = tagName || branchName || github.context.sha
  const normalizedIdentifier = kebabCase(buildIdentifier)
  const cleanBuildIdentifier = normalizedIdentifier.replace(/\//g, '--')

  return cleanBuildIdentifier
}

const run = async function () {
  try {
    console.log('Hello')
    // // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput("who-to-greet");
    // console.log(`Hello ${nameToGreet}!`);
    // const time = new Date().toTimeString();
    // core.setOutput("time", time);
    // // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)

    // Setting up the AWS environment
    await aws()

    // TODO: We'll need to clean up the @mattersupply/cli package to use our config here.
    const cfg = await getMatterConfig()

    const buildIdentifier = getBuildIdentifier()
    console.log('AWS: ', cfg, process.env, github, github.context.ref)
    console.log('Build: ', buildIdentifier)
    // const gitRef = process.env.GITHUB_REF

    return {}
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = { run }

/* istanbul ignore next */
if (require.main === module) {
  run()
}

// - name: Get yarn cache directory path
//         id: yarn-cache-dir-path
//         run: echo "::set-output name=dir::$(yarn cache dir)"

//       - uses: actions/cache@v1
//         id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
//         with:
//           path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
//           key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
//           restore-keys: |
//             ${{ runner.os }}-yarn-

//       - name: Checkout
//         uses: actions/checkout@v2

//       - name: Setup NPM
//         run: |
//           echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> .npmrc

//       - name: Git Version
//         id: gitversion
//         run: |
//           export BRANCH=${GITHUB_REF#refs/heads/}
//           export STAGE=${BRANCH//\//--}
//           echo ::set-output name=SOURCE_NAME::${GITHUB_REF#refs/*/}
//           echo ::set-output name=SOURCE_BRANCH::${BRANCH}
//           echo ::set-output name=SOURCE_TAG::${GITHUB_REF#refs/tags/}
//           echo ::set-env name=STAGE::${STAGE}

//       - name: Configure AWS credentials
//         uses: aws-actions/configure-aws-credentials@v1
//         with:
//           aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
//           aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
//           aws-region: us-east-1

//       - name: Install Services Dependencies
//         working-directory: packages/services
//         run: |
//           yarn install --production=false
//           yarn list

//       - name: Setup Services Environment
//         working-directory: packages/services
//         run: |
//           echo ${STAGE}
//           yarn --silent matter config:describe -s ${STAGE} develop --format=dotenv > .env
//           cat .env
